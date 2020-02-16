import { Controller, Get, Query } from '@nestjs/common';

import { consequencer } from 'src/utils/consequencer';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    testUser(): string {
        return 'This action is test user';
    }

    @Get('login')
    async login(@Query() query: any): Promise<object> {
        const { name, password } = query

        if (!name || !password) return consequencer.error('参数有误');
        if (password.length <= 6) return consequencer.error('密码有误');

        return this.userService.getToken({ name, password });
    }
}
