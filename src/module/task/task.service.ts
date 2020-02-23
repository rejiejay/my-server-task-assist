import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

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

    async add({ targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion }): Promise<Consequencer> {
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
        const targetSQL = targetId ? `targetId="${targetId}" AND ` : '';
        (pageNo && pageNo > 0) ? (pageNo -= 1) : (pageNo = 0);
        const list = await this.repository.query(`select * from task_assis_task where ${targetSQL}completeTimestamp IS NOT NULL order by sqlTimestamp desc limit ${pageNo}, 10;`);

        if (!list || list instanceof Array === false) return consequencer.error('sql incorrect query');

        const countRepository = await this.repository.query(`select count(*) from task_assis_task where ${targetSQL}completeTimestamp IS NOT NULL;`);
        if (!countRepository || countRepository instanceof Array === false || countRepository.length < 1) return consequencer.error('sql incorrect query');
        const count = countRepository[0]['count(*)']

        return consequencer.success({
            list,
            count: count ? count : 0
        });
    }
}
