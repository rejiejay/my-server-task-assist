import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { WhyService } from './why.service';

@Controller('why')
export class WhyController {
    constructor(private readonly whyService: WhyService) { }

    @Get()
    testWhy(): string {
        return 'This action is test why';
    }

    @Post('add')
    async setValue(@Body() body: any): Promise<object> {
        const { targetId, content } = body

        if (!targetId || !content) return consequencer.error('参数有误');

        return this.whyService.add({ targetId, content });
    }
}
