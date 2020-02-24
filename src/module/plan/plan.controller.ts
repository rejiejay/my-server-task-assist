import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
    constructor(private readonly PlanService: PlanService) { }

    @Get()
    testPlan(): string {
        return 'This action is test plan';
    }

    @Get('get/program')
    async getPlanpProgram(@Query() query: any): Promise<Consequencer> {
        const { targetId, pageNo } = query

        if (!targetId) return consequencer.error('参数有误');

        return await this.PlanService.getPlanpProgram(targetId, pageNo)
    }
}
