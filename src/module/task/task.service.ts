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

    async add({ targetId, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion }): Promise<Consequencer> {
        let task = new TaskAssisTask()
        task.targetId = targetId
        task.title = title
        task.content = content
        task.measure = measure
        task.span = span
        task.aspects = aspects
        task.worth = worth
        task.estimate = estimate
        task.putoffTimestamp = putoffTimestamp
        task.conclusion = conclusion

        const result = await this.repository.save(task);
        return result ? consequencer.success(result) : consequencer.error('add task to repository failure');
    }

    async update({ id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion }): Promise<Consequencer> {
        const task = await this.getById(id);

        if (task.result !== 1) return task;

        const result = await this.repository.update(task.data, { title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success({ id, title, content, measure, span, aspects, worth, estimate, putoffTimestamp, conclusion });

        return consequencer.error(`update task[${title}] failure`);
    }
}
