import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';
import { uploadByStr, getUploadInfor, pullCopyUpload, pullDeleteUpload } from 'src/sdk/tencent-oss';

import { TaskAssisTask } from './entity/task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskAssisTask)
        private readonly repository: Repository<TaskAssisTask>,
    ) { }

    async getById(taskId: number): Promise<Consequencer> {
        const task = await this.repository.findOne({ id: taskId });

        if (!task) return consequencer.error('This task does not exist');

        /**
         * 含义: 顺手清空一下推迟时间
         */
        const nowTimestamp = new Date().getTime()
        if (task.putoffTimestamp && nowTimestamp > task.putoffTimestamp) {

            const result = await this.repository.update(task, { putoffTimestamp: null });

            if (!result || !result.raw || result.raw.warningCount !== 0) return consequencer.error('This task is exist, but update putoffTimestamp sql incorrect!');
        }

        return consequencer.success(task)
    }

    /**
     * 含义: 随机获取 未推迟 且 未完成 的任务
     */
    async getUnDoneByRandomTarget(targetId: number): Promise<Consequencer> {
        const nowTimestamp = new Date().getTime()
        const result = await this.repository.query(`select * from task_assis_task where completeTimestamp IS NULL AND targetId="${targetId}" AND (putoffTimestamp IS NULL OR putoffTimestamp<${nowTimestamp}) order by rand() limit 1;`);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('你已完成所有任务');
        return consequencer.success(result[0]);
    }

    /**
     * 含义: 随机获取 未推迟 且 未完成 的任务
     */
    async getUnDoneByRandom(): Promise<Consequencer> {
        const nowTimestamp = new Date().getTime()
        const result = await this.repository.query(`select * from task_assis_task where completeTimestamp IS NULL AND (putoffTimestamp IS NULL OR putoffTimestamp<${nowTimestamp}) order by rand() limit 1;`);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('你已完成所有任务');
        return consequencer.success(result[0]);
    }

    async add({ targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion, image, completeTimestamp }): Promise<Consequencer> {
        let task = new TaskAssisTask()
        task.targetId = targetId
        task.title = title
        task.content = content
        task.measure = measure
        task.span = span
        task.aspects = aspects
        task.worth = worth
        task.estimate = estimate
        task.putoffTimestamp = putoffTimestamp
        task.conclusion = conclusion
        task.image = image
        task.completeTimestamp = completeTimestamp // 注意: 结论会影响到
        task.sqlTimestamp = new Date().getTime()

        const result = await this.repository.save(task);
        return result ? consequencer.success(result) : consequencer.error('add task to repository failure');
    }

    async update({ id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion }): Promise<Consequencer> {
        const task = await this.getById(id);

        if (task.result !== 1) return task;

        const sqlTimestamp = new Date().getTime()
        const result = await this.repository.update(task.data, { title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion, sqlTimestamp });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success({ id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion, sqlTimestamp });

        return consequencer.error(`update task[${title}] failure`);
    }

    async complete(id: number): Promise<Consequencer> {
        const task = await this.getById(id);

        if (task.result !== 1) return task;

        let { completeTimestamp } = task.data
        if (completeTimestamp) return consequencer.error(`The task has been completed`);

        completeTimestamp = new Date().getTime()
        const result = await this.repository.update(task.data, { completeTimestamp });

        task.data.completeTimestamp = completeTimestamp
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(task.data);

        return consequencer.error(`complete task failure`);
    }

    async delete(id: number): Promise<Consequencer> {
        const task = await this.getById(id);

        if (task.result !== 1) return task;

        if (task.data.image) {
            /** 删除图片? */
            const del = await this.delImage({
                path: task.data.image
            })

            if (del.result !== 1) return del;
        }

        const result = await this.repository.delete(task.data)
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success();

        return consequencer.error(`delete task failure`);
    }

    async getExecutableTasks(targetId: string): Promise<Consequencer> {
        const nowTimestamp = new Date().getTime()
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : ''
        const result = await this.repository.query(`select * from task_assis_task where completeTimestamp IS NULL AND ${targetSQL}(putoffTimestamp IS NULL OR putoffTimestamp<${nowTimestamp}) order by sqlTimestamp desc;`);

        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        return consequencer.success(result);
    }

    async getPutoffTasks(targetId: string): Promise<Consequencer> {
        const nowTimestamp = new Date().getTime()
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : ''
        const result = await this.repository.query(`select * from task_assis_task where completeTimestamp IS NULL AND putoffTimestamp IS NOT NULL AND ${targetSQL}putoffTimestamp>${nowTimestamp} order by sqlTimestamp desc;`);

        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        return consequencer.success(result);
    }

    /**
     * 含义: 查询完成任务
     * 注意: pageNo SQL 从0开始
     */
    async getCompleteTasks(targetId: string, pageNo: number): Promise<Consequencer> {
        /** 注意: 任务内容为空，就一定是结论；此处的需求不统计结论； */
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : '';
        (pageNo && pageNo > 0) ? (pageNo -= 1) : (pageNo = 0);
        const list = await this.repository.query(`select * from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp IS NOT NULL order by sqlTimestamp desc limit ${(pageNo * 10)}, 10;`);

        if (!list || list instanceof Array === false) return consequencer.error('sql incorrect query');

        const countRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}completeTimestamp IS NOT NULL;`);
        if (!countRepository || countRepository instanceof Array === false || countRepository.length < 1) return consequencer.error('sql incorrect query');
        const count = countRepository[0]['count(*)']

        return consequencer.success({
            list,
            count: count ? count : 0
        });
    }

    async statisticsTasks(targetId: string): Promise<Consequencer> {
        /** 注意: 任务内容为空，就一定是结论；此处的需求不统计结论； */
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : '';
        const nowTimestamp = new Date().getTime()
        const minuteTimestamp = 1000 * 60
        const hourTimestamp = minuteTimestamp * 60
        const dayTimestamp = hourTimestamp * 24

        const monthAgoTimestamp = nowTimestamp - (dayTimestamp * 30)
        const monthCountRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp>${monthAgoTimestamp};`);
        if (!monthCountRepository || monthCountRepository instanceof Array === false || monthCountRepository.length < 1) return consequencer.error('sql incorrect query');
        const monthCount = monthCountRepository[0]['count(*)']

        const twoWeekAgoTimestamp = nowTimestamp - (dayTimestamp * 14)
        const twoWeekCountRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp>${twoWeekAgoTimestamp};`);
        if (!twoWeekCountRepository || twoWeekCountRepository instanceof Array === false || twoWeekCountRepository.length < 1) return consequencer.error('sql incorrect query');
        const twoWeekCount = twoWeekCountRepository[0]['count(*)']

        const oneWeekAgoTimestamp = nowTimestamp - (dayTimestamp * 7)
        const oneWeekCountRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp>${oneWeekAgoTimestamp};`);
        if (!oneWeekCountRepository || oneWeekCountRepository instanceof Array === false || oneWeekCountRepository.length < 1) return consequencer.error('sql incorrect query');
        const oneWeekCount = oneWeekCountRepository[0]['count(*)']

        const threeDayAgoTimestamp = nowTimestamp - (dayTimestamp * 3)
        const threeDayCountRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp>${threeDayAgoTimestamp};`);
        if (!threeDayCountRepository || threeDayCountRepository instanceof Array === false || threeDayCountRepository.length < 1) return consequencer.error('sql incorrect query');
        const threeDayCount = threeDayCountRepository[0]['count(*)']

        const towDayAgoTimestamp = nowTimestamp - (dayTimestamp * 2)
        const towDayCountRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp>${towDayAgoTimestamp};`);
        if (!towDayCountRepository || towDayCountRepository instanceof Array === false || towDayCountRepository.length < 1) return consequencer.error('sql incorrect query');
        const towDayCount = towDayCountRepository[0]['count(*)']

        const oneDayAgoTimestamp = nowTimestamp - (dayTimestamp * 1)
        const oneDayCountRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}content IS NOT NULL AND completeTimestamp>${oneDayAgoTimestamp};`);
        if (!oneDayCountRepository || oneDayCountRepository instanceof Array === false || oneDayCountRepository.length < 1) return consequencer.error('sql incorrect query');
        const oneDayCount = oneDayCountRepository[0]['count(*)']

        return consequencer.success({
            monthCount,
            twoWeekCount,
            oneWeekCount,
            threeDayCount,
            towDayCount,
            oneDayCount
        });
    }

    async statisticsConclusionTasks(targetId: string): Promise<Consequencer> {
        const countRepository = await this.repository.query(`select count(*) from task_assis_task where targetId="${targetId}" AND conclusion IS NOT NULL;`);
        if (!countRepository || countRepository instanceof Array === false || countRepository.length < 1) return consequencer.error('sql incorrect query');
        const count = countRepository[0]['count(*)']

        return consequencer.success(count || 0);
    }

    async listConclusionTasks(targetId: string, pageNo: number): Promise<Consequencer> {
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : '';
        (pageNo && pageNo > 0) ? (pageNo -= 1) : (pageNo = 0);
        const list = await this.repository.query(`select * from task_assis_task where ${targetSQL}conclusion IS NOT NULL order by sqlTimestamp desc limit ${(pageNo * 10)}, 10;`);

        if (!list || list instanceof Array === false) return consequencer.error('sql incorrect query');

        return consequencer.success(list);
    }

    async randomConclusionTasks(targetId: string): Promise<Consequencer> {
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : '';
        const random = await this.repository.query(`select * from task_assis_task where ${targetSQL}conclusion IS NOT NULL order by rand() limit 10;`);

        if (!random || random instanceof Array === false) return consequencer.error('sql incorrect query');

        return consequencer.success(random);
    }

    async uploadImageTemporary(imageBase64String: string): Promise<Consequencer> {
        const nowTimestamp = new Date().getTime()
        let path = `myweb/task-assist/temporary/${nowTimestamp}.png`;

        /** 注意: UI值是经过Base64加密过后的值 */
        const str = imageBase64String.replace(/^data:image\/\w+;base64,/, '')

        return await uploadByStr({ str, path, encoding: 'base64' }).then(() => {
            return consequencer.success(path);
        }, error => {
            return consequencer.error(error);
        })
    }

    async toProduceImage({ temPath }): Promise<Consequencer> {
        const uploadInfor = await getUploadInfor(temPath).then((infor) => {
            return consequencer.success(infor);
        }, error => {
            return consequencer.error(error);
        })

        /** 含义: 路径下未找到任何数据 */
        if (uploadInfor.result !== 1) return uploadInfor

        const nowTimestamp = new Date().getTime()
        const producePath = `myweb/task-assist/${nowTimestamp}.png`;
        const copyUpload = await pullCopyUpload({ oldPath: temPath, newPath: producePath }).then((infor) => {
            return consequencer.success(infor);
        }, error => {
            return consequencer.error(error);
        })

        /** 含义: 复制失败 */
        if (copyUpload.result !== 1) return copyUpload

        /** 含义: 删除 */
        const deleteUpload = await this.delImage({
            path: temPath
        })
        if (deleteUpload.result !== 1) return deleteUpload

        return consequencer.success(producePath);
    }

    async editConclusion({ id, title, conclusion, image }): Promise<Consequencer> {
        const task = await this.getById(id);

        if (task.result !== 1) return task;
        const oldTask = task.data

        const oldImage = oldTask.image
        let newImage = null
        if (oldImage && image && oldImage !== image) {
            /** 更新图片? */
            const update = await this.updatePoduceImage({
                oldImagePath: oldImage,
                newImagePath: image,
            })

            if (update.result !== 1) return update;

            newImage = update.data
        } else if (oldImage && !image) {
            /** 删除图片? */
            const del = await this.delImage({
                path: oldImage
            })

            if (del.result !== 1) return del;

            newImage = null
        } else if (!oldImage && image) {
            /** 新增图片? */
            const transform = await this.toProduceImage({
                temPath: image
            })

            if (transform.result !== 1) return transform;

            newImage = transform.data
        }

        const sqlTimestamp = new Date().getTime()
        const result = await this.repository.update(task.data, { title, conclusion, image: newImage, sqlTimestamp });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success();

        return consequencer.error(`update conclusion[${title}] failure`);

    }

    async delImage({ path }): Promise<Consequencer> {
        const delInfor = await getUploadInfor(path).then((infor) => {
            return consequencer.success(infor);
        }, error => {
            return consequencer.error(error);
        })

        /** 含义: 路径下未找到任何数据 */
        if (delInfor.result !== 1) return delInfor

        const deleteUpload = await pullDeleteUpload(path).then((infor) => {
            return consequencer.success(infor);
        }, error => {
            return consequencer.error(error);
        })

        /** 含义: 删除失败 */
        if (deleteUpload.result !== 1) return deleteUpload

        return consequencer.success();
    }

    async updatePoduceImage({ oldImagePath, newImagePath }): Promise<Consequencer> {
        /** 删除掉图片 */
        const del = await this.delImage({
            path: oldImagePath
        })

        if (del.result !== 1) return del;

        /** 更新图片 */
        const update = await this.toProduceImage({
            temPath: newImagePath
        })

        if (update.result !== 1) return update;
        return consequencer.success(update.data);
    }
}
