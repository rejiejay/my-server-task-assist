import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer } from 'src/utils/consequencer';
import { createRandomStr } from 'src/utils/string-handle';

import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // 刷新 token 和 expired
    async refresh(user: User): Promise<object> {
        const newToken = createRandomStr({length: 16})
        const oneHour = 1000 * 60 *60
        const expiredTime = new Date().getTime() + oneHour

        const result = await this.userRepository.update(user, {token: newToken, expired: expiredTime});

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(newToken);

        return consequencer.error('refresh token failure', 233, result);
    }

    async getToken({ name, password }): Promise<object> {
        const user = await this.userRepository.findOne({ name });

        if (!user || user.password !== password) return consequencer.error('用户或密码错误');

        return this.refresh(user);
    }

    async verifyToken({ token }): Promise<object> {
        const user = await this.userRepository.findOne({ token });

        if (!user) return consequencer.error('登录失败');

        return consequencer.success(user);
    }
}
