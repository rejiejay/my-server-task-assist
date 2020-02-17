import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';

import { consequencer } from 'src/utils/consequencer';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    testHome(): object {
        return consequencer.success();
    }
}
