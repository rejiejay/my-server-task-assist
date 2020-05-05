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

    async getById(id: number): Promise<Consequencer> {
        const mind = {
            current: null,
            parent: null,
            childNodes: [],
        }
        const currentMind = await this.repository.findOne({ id });

        if (!currentMind) return consequencer.error('This Mind does not exist');
        mind.current = currentMind

        if (currentMind.id !== 1) {
            const parentMind = await this.repository.findOne({ id: currentMind.parentid });
            if (!parentMind) return consequencer.error('This Mind find parent SQL have error');
            mind.parent = parentMind
        }

        const list = await this.repository.query(`select * from require_assis_mind where parentid="${currentMind.id}"`);

        if (!list || list instanceof Array === false) return consequencer.error('This Mind find childNodes sql incorrect query');
        mind.childNodes = list

        return consequencer.success(mind)
    }
}
