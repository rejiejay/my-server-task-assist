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

    @Get('get/id')
    async getById(@Query() query: any): Promise<Consequencer> {
        const { id } = query

        if (!id) return consequencer.error('参数有误');

        return await this.mindService.getById(id)
    }

    @Post('edit/id')
    async editById(@Body() body: any): Promise<Consequencer> {
        const { id, title, content, timeSpan, view, nature } = body

        if (!id || !title || !content) return consequencer.error('参数有误');

        return await this.mindService.editById({ id, title, content, timeSpan, view, nature })
    }

    @Get('get/random')
    async getRandom(@Query() query: any): Promise<Consequencer> {
        return await this.mindService.getRandom()
    }

    @Post('edit/parent/id')
    async editParentById(@Body() body: any): Promise<Consequencer> {
        const { newParentId, oldId } = body

        if (!newParentId || !oldId) return consequencer.error('参数有误');

        return await this.mindService.editParentById({ newParentId, oldId })
    }

    @Post('add/parentid')
    async addByParentId(@Body() body: any): Promise<Consequencer> {
        const { parentid, title, content, timeSpan, view, nature } = body

        if (!parentid || !title || !content) return consequencer.error('参数有误');

        return await this.mindService.addByParentId({ parentid, title, content, timeSpan, view, nature })
    }

    @Post('del/id')
    async delByMindId(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id && +id !== 1) return consequencer.error('参数有误');

        return await this.mindService.delByMindId({ id })
    }
}
