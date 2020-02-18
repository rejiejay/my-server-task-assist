import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Get()
    testUser(): string {
        return 'This action is test target';
    }
}
