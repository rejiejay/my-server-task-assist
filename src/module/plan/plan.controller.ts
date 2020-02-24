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

}
