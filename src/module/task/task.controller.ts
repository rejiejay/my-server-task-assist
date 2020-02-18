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
}
