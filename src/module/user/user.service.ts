import { Injectable } from '@nestjs/common';

import { consequencer } from 'src/utils/consequencer';

@Injectable()
export class UserService {
    async getToken({ name, password }): Promise<object> {
        return consequencer.success();
    }
}
