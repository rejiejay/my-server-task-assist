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

    @Get('get/one')
    async getOne(@Query() query: any): Promise<Consequencer> {
        const { id } = query

        if (!id) return consequencer.error('参数有误');

        return await this.PlanService.getById(id)
    }

    @Get('get/program/list')
    async getPlanpProgram(@Query() query: any): Promise<Consequencer> {
        const { targetId, pageNo } = query

        if (!targetId) return consequencer.error('参数有误');

        return await this.PlanService.getPlanpProgram(targetId, pageNo)
    }

    /**
     * 定义: 新增计划
     * 注意: 通过 program 和 according 区分 新增类型
     * 类型: 1.program类型 2.according类型 
     */
    @Post('add')
    async addPlan(@Body() body: any): Promise<Consequencer> {
        const { targetId, program, according } = body

        if (!targetId) return consequencer.error('参数有误');
        if (!program && !according) return consequencer.error('参数有误');

        return await this.PlanService.addPlan({ targetId, program, according })
    }

    @Post('program/edit')
    async editProgramPlan(@Body() body: any): Promise<Consequencer> {
        const { id, program } = body

        if (!id || !program) return consequencer.error('参数有误');

        return await this.PlanService.editPlan({ id, program, according: null })
    }

    @Post('according/edit')
    async editAccordingPlan(@Body() body: any): Promise<Consequencer> {
        const { id, according } = body

        if (!id || !according) return consequencer.error('参数有误');

        return await this.PlanService.editPlan({ id, according, program: null })
    }

    @Get('get/according/random')
    async getPlanpAccording(@Query() query: any): Promise<Consequencer> {
        const { targetId } = query

        if (!targetId) return consequencer.error('参数有误');

        return await this.PlanService.getPlanpAccording(targetId)
    }

    @Post('del')
    async delPlan(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return await this.PlanService.delPlan({ id })
    }
}
