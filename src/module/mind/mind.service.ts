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

    async editById({ id, title, content, timeSpan, view, nature }): Promise<Consequencer> {
        const currentMind = await this.repository.findOne({ id });
        if (!currentMind) return consequencer.error('This Mind does not exist');

        const result = await this.repository.update(currentMind, { title, content, timeSpan, view, nature });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success({ id, title, content, timeSpan, view, nature });

        return consequencer.error(`update mind[${id}] failure`);
    }

    async getRandom(): Promise<Consequencer> {
        const list = await this.repository.query('select * from require_assis_mind order by rand() limit 1;');
        if (!list || list instanceof Array === false) return consequencer.error('This Mind find random sql incorrect query');

        const currentId = list[0].id
        return this.getById(currentId)
    }

}
