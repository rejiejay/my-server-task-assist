import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { MindService } from './mind.service';

@Controller('mind')
export class MindController {
    constructor(private readonly mindService: MindService) { }

    @Get()
    testMind(): string {
        return 'This action is test mind';
    }

    @Get('get/all')
    async getAll(@Query() query: any): Promise<Consequencer> {
        return await this.mindService.getAll()
    }
}
