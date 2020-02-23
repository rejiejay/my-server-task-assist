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
}
