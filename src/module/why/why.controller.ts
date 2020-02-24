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

    @Get('get/three')
    async getNewLists(@Query() query: any): Promise<object> {
        const { targetId } = query

        if (!targetId) return consequencer.error('参数有误');

        return this.whyService.getNewLists({ targetId });
    }

    @Post('edit')
    async editValue(@Body() body: any): Promise<object> {
        const { id, content } = body

        if (!id || !content) return consequencer.error('参数有误');

        return this.whyService.edit({ id, content });
    }

    @Get('get/one')
    async getById(@Query() query: any): Promise<object> {
        const { id } = query

        if (!id) return consequencer.error('参数有误');

        return this.whyService.getById(id);
    }

    @Post('delete')
    async deleteValue(@Body() body: any): Promise<object> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return this.whyService.delete({ id });
    }

    @Get('get/reasonable')
    async getByReasonable(@Query() query: any): Promise<object> {
        const { targetId } = query

        if (!targetId) return consequencer.error('参数有误');

        return this.whyService.getByReasonable(targetId);
    }

    @Get('get/random')
    async getByRandom(@Query() query: any): Promise<object> {
        const { targetId, count } = query

        if (!targetId) return consequencer.error('参数有误');

        return this.whyService.getByRandom(targetId, count ? +count : 1);
    }

    @Post('edit/reasonable')
    async editReasonable(@Body() body: any): Promise<object> {
        let { id, setToFullest } = body

        if (!id) return consequencer.error('参数有误');

        setToFullest = setToFullest ? true : false

        return this.whyService.editReasonable(id, setToFullest);
    }
}
