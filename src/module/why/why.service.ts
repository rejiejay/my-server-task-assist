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

    async add({ targetId, content }): Promise<Consequencer> {
        let task = new TaskAssisWhy()
        task.targetId = targetId
        task.content = content
        task.sqlTimestamp = new Date().getTime()

        const result = await this.repository.save(task);
        return result ? consequencer.success(result) : consequencer.error('add task to repository failure');
    }

    /**
     * 含义: 获取最新3条数据
     */
    async getNewLists({ targetId }): Promise<Consequencer> {

        const result = await this.repository.query(`select * from task_assis_why where targetId="${targetId}" order by sqlTimestamp desc limit 3;`);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');

        return consequencer.success(result);
    }
}
