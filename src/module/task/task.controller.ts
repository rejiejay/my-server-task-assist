import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Get()
    testTask(): string {
        return 'This action is test Task';
    }

    @Get('get/one')
    async getTask(@Query() query: any): Promise<Consequencer> {
        const { taskId, targetId } = query

        if (taskId) return await this.taskService.getById(taskId);

        if (targetId) return await this.taskService.getUnDoneByRandomTarget(targetId);

        return await this.taskService.getUnDoneByRandom()
    }

    /**
     * 注意: Task新增不能新增图片
     */
    @Post('add')
    async setValue(@Body() body: any): Promise<object> {
        const { targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion } = body

        if (!targetId || !title || !content) return consequencer.error('参数有误');

        return this.taskService.add({ targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion, image: null, completeTimestamp: null });
    }

    @Post('update')
    async updateValue(@Body() body: any): Promise<object> {
        const { id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion } = body

        if (!id || !title) return consequencer.error('参数有误');

        if (!content) return consequencer.error('内容为必填项, 如果是结论则无法继续此操作!');

        return this.taskService.update({ id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion });
    }

    @Post('complete')
    async completeValue(@Body() body: any): Promise<object> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return this.taskService.complete(id);
    }

    @Post('delete')
    async deleteValue(@Body() body: any): Promise<object> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return this.taskService.delete(id);
    }

    @Get('get/list/executable')
    async getExecutableTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        return await this.taskService.getExecutableTasks(targetId);
    }

    @Get('get/list/putoff')
    async getPutoffTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        return await this.taskService.getPutoffTasks(targetId);
    }

    @Get('get/list/complete')
    async getCompleteTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId, pageNo } = query

        return await this.taskService.getCompleteTasks(targetId, +pageNo);
    }

    @Get('statistics/list/complete')
    async statisticsCompleteTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        return await this.taskService.statisticsCompleteTasks(targetId);
    }

    @Get('statistics')
    async statisticsTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        return await this.taskService.statisticsTasks(targetId);
    }

    @Get('conclusion/statistics')
    async statisticsConclusionTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        return await this.taskService.statisticsConclusionTasks(targetId);
    }

    @Get('conclusion/list')
    async listConclusionTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId, pageNo, pageSize } = query

        return await this.taskService.listConclusionTasks(targetId, +pageNo, +pageSize);
    }

    @Get('conclusion/random')
    async randomConclusionTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        return await this.taskService.randomConclusionTasks(targetId);
    }

    @Post('conclusion/add')
    async setConclusionValue(@Body() body: any): Promise<object> {
        const { targetId, title, conclusion } = body
        let { image } = body

        if (!title || !conclusion) return consequencer.error('参数有误');

        /**
         * 注意: image是一个路径(临时), 需要转化为正式路径
         */
        if (image) {
            const transform = await this.taskService.toProduceImage({
                temPath: image
            })

            if (transform.result !== 1) return transform;

            image = transform.data
        }

        /**
         * 注意: 因为是新增, 所以部分参数必定为空
         */
        const completeTimestamp = new Date().getTime()
        return this.taskService.add({ targetId, title, content: null, measure: null, span: null, aspects: null, worth: null, estimate: null, putoffTimestamp: null, conclusion, image, completeTimestamp });
    }

    /**
     * 注意: 返回的是一个路径(临时)
     */
    @Post('image/upload')
    async uploadImage(@Body() body: any): Promise<object> {
        const { imageBase64String } = body

        if (!imageBase64String) return consequencer.error('参数有误');

        return this.taskService.uploadImageTemporary(imageBase64String);
    }

    @Post('conclusion/edit')
    async editConclusionValue(@Body() body: any): Promise<object> {
        const { id, title, conclusion, image } = body

        if (!id || !title || !conclusion) return consequencer.error('参数有误');

        return this.taskService.editConclusion({ id, title, conclusion, image });
    }

    @Post('conclusion/delete')
    async deleteConclusionValue(@Body() body: any): Promise<object> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return this.taskService.deleteConclusion(id);
    }

    @Get('image/credential')
    async getImageCredential(@Query() query: any): Promise<Consequencer> {
        return await this.taskService.getImageCredential();
    }

    @Get('conclusion/search')
    async searchConclusionTasks(@Query() query: any): Promise<Consequencer> {
        const { targetId, search } = query

        if (!targetId || !search) return consequencer.error('参数有误');

        return await this.taskService.searchConclusionTasks(targetId, search);
    }
}
