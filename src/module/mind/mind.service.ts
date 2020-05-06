import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';
import { createRandomStr } from 'src/utils/string-handle';

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

        if (+currentMind.id !== 1) {
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

    async editParentById({ newParentId, oldId }): Promise<Consequencer> {
        const currentMind = await this.repository.findOne({ id: oldId });
        if (!currentMind) return consequencer.error('This Mind does not exist');

        const parentMind = await this.repository.findOne({ id: newParentId });
        if (!parentMind) return consequencer.error('Parent Mind does not exist');

        const result = await this.repository.update(currentMind, { parentid: parentMind.id });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(currentMind);

        return consequencer.error(`update mind[${oldId}] failure`);
    }

    async addByParentId({ parentid, title, content, timeSpan, view, nature }): Promise<Consequencer> {
        const parentMind = await this.repository.findOne({ id: parentid });
        if (!parentMind) return consequencer.error(`This parent ${parentid} Mind does not exist`);

        let mind = new RequireAssisMind()
        mind.id = new Date().getTime()
        mind.alias = createRandomStr({ length: 4, noUpperCase: true })
        mind.parentid = parentid
        mind.title = title
        mind.content = content
        mind.timeSpan = timeSpan
        mind.view = view
        mind.nature = nature

        const result = await this.repository.save(mind);
        return result ? consequencer.success(mind) : consequencer.error('add task to repository failure');
    }

    async delByMindId({ id }): Promise<Consequencer> {
        const currentMind = await this.repository.findOne({ id });
        if (!currentMind) return consequencer.error('This Mind does not exist');

        const list = await this.repository.query(`select * from require_assis_mind where parentid="${currentMind.id}"`);
        if (list instanceof Array && list.length > 0) return consequencer.error('Cannot delete Mind elements with child nodes');

        const result = await this.repository.delete(currentMind);
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(currentMind);

        return consequencer.error(`del Mind[${id}] failure`);
    }
}
