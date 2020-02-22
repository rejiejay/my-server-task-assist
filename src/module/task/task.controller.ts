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

        if (targetId) return await this.taskService.getRandomByTarget(targetId);

        return await this.taskService.getRandom()
    }

    @Post('add')
    async setValue(@Body() body: any): Promise<object> {
        const { targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion } = body

        if (!targetId || !title || !content) return consequencer.error('参数有误');

        return this.taskService.add({ targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion });
    }
}
