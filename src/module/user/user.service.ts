import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer } from 'src/utils/consequencer';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getToken({ name, password }): Promise<object> {
        const user = await this.userRepository.findOne({ name });

        if (!user || user.password !== password) return consequencer.error('用户或密码错误');

        return consequencer.success(user.token);
    }
}
