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

    @Post('add')
    async setValue(@Body() body: any): Promise<object> {
        const { targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion } = body

        if (!targetId || !title || !content) return consequencer.error('参数有误');

        return this.taskService.add({ targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion });
    }

    @Post('update')
    async updateValue(@Body() body: any): Promise<object> {
        const { id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion } = body

        if (!id || !title || !content) return consequencer.error('参数有误');

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
}
