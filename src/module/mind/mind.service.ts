import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { RequireAssisMind } from './entity/mind.entity';

@Injectable()
export class MindService {
    constructor(
        @InjectRepository(RequireAssisMind)
        private readonly repository: Repository<RequireAssisMind>,
    ) { }

    async getAll(): Promise<Consequencer> {
        const list = await this.repository.query(`select * from require_assis_mind`);

        if (!list || list instanceof Array === false) return consequencer.error('sql incorrect query');

        return consequencer.success(list)
    }
}
