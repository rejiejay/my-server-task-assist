import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';
import { createRandomStr } from 'src/utils/string-handle';
import { AuthHandle } from 'src/auth/auth.handle';
import { ResultCode } from 'src/config/result-code';

import { TaskAssisUser } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(TaskAssisUser)
        private readonly userRepository: Repository<TaskAssisUser>,
    ) { }

    // 刷新 token 和 expired
    async refresh(user: TaskAssisUser): Promise<Consequencer> {
        const newToken = createRandomStr({ length: 16 })
        const oneHour = 1000 * 60 * 60
        const expiredTime = new Date().getTime() + oneHour

        const result = await this.userRepository.update(user, { token: newToken, expired: expiredTime });

        if (result && result.raw && result.raw.warningCount === 0) {
            AuthHandle.set(newToken, expiredTime);
            return consequencer.success(newToken);
        } else {
            return consequencer.error('refresh token failure', 233, result);
        }
    }

    async getToken({ name, password }): Promise<object> {
        const user = await this.userRepository.findOne({ name });

        if (!user || user.password !== password) return consequencer.error('用户或密码错误');

        return this.refresh(user);
    }

    async verifyToken({ token }): Promise<object> {
        const user = await this.userRepository.findOne({ token });

        /**
         * 含义: 未有凭证
         */
        if (!user) return consequencer.error(ResultCode.ACCESS_USER_FAILED.description, ResultCode.ACCESS_USER_FAILED.value);

        /**
         * 含义: 有凭证, 并且有效期内
         */
        if (user.expired > new Date().getTime()) {
            AuthHandle.set(user.token, user.expired);
            return consequencer.success(user.token);
        }

        /**
         * 含义: 有凭证, 但是过期
         * 结论: 刷新凭证
         */
        const refresh = await this.refresh(user);

        if (refresh.result !== 1) {
            return consequencer.error(`${ResultCode.ACCESS_HANDLE_FAILED.description}, ${refresh.message}`, ResultCode.ACCESS_HANDLE_FAILED.value);
        }

        return refresh
    }
}
