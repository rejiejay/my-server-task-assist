import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskAssisTask } from './entity/task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskAssisTask)
        private readonly repository: Repository<TaskAssisTask>,
    ) { }

    async getById(taskId: number): Promise<Consequencer> {
        const result = await this.repository.findOne({ id: taskId });

        return result ? consequencer.success(result) : consequencer.error('This task does not exist');
    }

    async getRandomByTarget(targetId: number): Promise<Consequencer> {
        const result = await this.repository.query(`select * from task_assis_task where targetId="${targetId}" order by rand() limit 1;`);
        if (!result || result instanceof Array === false || result.length === 0) return consequencer.error('sql incorrect query');
        return consequencer.success(result[0]);
    }

    async getRandom(): Promise<Consequencer> {
        const result = await this.repository.query(`select * from task_assis_task order by rand() limit 1;`);
        if (!result || result instanceof Array === false || result.length === 0) return consequencer.error('sql incorrect query');
        return consequencer.success(result[0]);
    }
}
