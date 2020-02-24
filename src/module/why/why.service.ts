import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskAssisWhy } from './entity/why.entity';

@Injectable()
export class WhyService {
    constructor(
        @InjectRepository(TaskAssisWhy)
        private readonly repository: Repository<TaskAssisWhy>,
    ) { }

    async getById(id: number): Promise<Consequencer> {
        const why = await this.repository.findOne({ id });

        if (!why) return consequencer.error('This reason does not exist');

        return consequencer.success(why)
    }

    async add({ targetId, content }): Promise<Consequencer> {
        let why = new TaskAssisWhy()
        why.targetId = targetId
        why.content = content
        why.sqlTimestamp = new Date().getTime()

        const result = await this.repository.save(why);
        return result ? consequencer.success(result) : consequencer.error('add why to repository failure');
    }

    /**
     * 含义: 获取最新3条数据
     */
    async getNewLists({ targetId }): Promise<Consequencer> {

        const result = await this.repository.query(`select * from task_assis_why where targetId="${targetId}" order by sqlTimestamp desc limit 3;`);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');

        return consequencer.success(result);
    }

    async edit({ id, content }): Promise<Consequencer> {
        const why = await this.getById(id);

        if (why.result !== 1) return why;

        const sqlTimestamp = new Date().getTime()
        const result = await this.repository.update(why.data, { content, sqlTimestamp });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(why.data);

        return consequencer.error(`update why[${id}] failure`);
    }

    async delete({ id }): Promise<Consequencer> {
        const why = await this.getById(id);

        if (why.result !== 1) return why;

        const result = await this.repository.delete(why.data);
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(why.data);
        return consequencer.error(`delete why[${id}] failure`);
    }

    async getByReasonable(targetId: string): Promise<Consequencer> {
        const result = await this.repository.query(`select * from task_assis_why where targetId="${targetId}" AND stickyTimestamp IS NOT NULL order by stickyTimestamp desc;`);

        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        return consequencer.success(result);
    }

    async getByRandom(targetId: string, count: number): Promise<Consequencer> {
        const result = await this.repository.query(`select * from task_assis_why where targetId="${targetId}" order by rand() limit ${count};`);

        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        return consequencer.success(result);
    }

    async editReasonable(id: number, setToFullest: boolean): Promise<Consequencer> {
        const why = await this.getById(id);

        if (why.result !== 1) return why;

        const nowTimestamp = new Date().getTime()
        const sqlTimestamp = nowTimestamp
        const stickyTimestamp = setToFullest ? nowTimestamp : null
        const result = await this.repository.update(why.data, { stickyTimestamp, sqlTimestamp });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(why.data);

        return consequencer.error(`update why[${id}] failure`);
    }
}
