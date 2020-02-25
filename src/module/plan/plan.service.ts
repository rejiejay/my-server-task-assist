import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskAssisPlan } from './entity/plan.entity';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(TaskAssisPlan)
        private readonly repository: Repository<TaskAssisPlan>,
    ) { }

    async getById(id: number): Promise<Consequencer> {
        const plan = await this.repository.findOne({ id });

        if (!plan) return consequencer.error('This Plan does not exist');

        return consequencer.success(plan)
    }

    /**
     * 含义: 查询 计划方案
     * 注意: pageNo SQL 从0开始
     */
    async getPlanpProgram(targetId: string, pageNo: number): Promise<Consequencer> {
        (pageNo && pageNo > 0) ? (pageNo -= 1) : (pageNo = 0);
        const list = await this.repository.query(`select * from task_assis_plan where targetId="${targetId}" AND program IS NOT NULL order by sqlTimestamp desc limit ${(pageNo * 10)}, 10;`);

        if (!list || list instanceof Array === false) return consequencer.error('sql incorrect query');

        const countRepository = await this.repository.query(`select count(*) from task_assis_plan where targetId="${targetId}" AND program IS NOT NULL;`);
        if (!countRepository || countRepository instanceof Array === false || countRepository.length < 1) return consequencer.error('sql incorrect query');
        const count = countRepository[0]['count(*)']

        return consequencer.success({
            list,
            count: count ? count : 0
        });
    }

    async addPlan({ targetId, program, according }): Promise<Consequencer> {
        let plan = new TaskAssisPlan()
        plan.targetId = targetId
        plan.program = program
        plan.according = according
        plan.sqlTimestamp = new Date().getTime()

        const result = await this.repository.save(plan);
        return result ? consequencer.success(result) : consequencer.error('add plan to repository failure');
    }

    async editPlan({ id, program, according }): Promise<Consequencer> {
        const plan = await this.getById(id);

        if (plan.result !== 1) return plan;

        const sqlTimestamp = new Date().getTime()
        const result = await this.repository.update(plan.data, { program, according, sqlTimestamp });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(plan);

        return consequencer.error(`update plan[${id}] failure`);
    }

    async getPlanpAccording(targetId: string): Promise<Consequencer> {
        const random = await this.repository.query(`select * from task_assis_plan where targetId="${targetId}" AND according IS NOT NULL order by rand() limit 10;`);

        if (!random || random instanceof Array === false) return consequencer.error('sql incorrect query');

        const countRepository = await this.repository.query(`select count(*) from task_assis_plan where targetId="${targetId}" AND according IS NOT NULL;`);
        if (!countRepository || countRepository instanceof Array === false || countRepository.length < 1) return consequencer.error('sql incorrect query');
        const count = countRepository[0]['count(*)']

        return consequencer.success({
            random,
            count: count ? count : 0
        });
    }

    async delPlan({ id }): Promise<Consequencer> {
        const plan = await this.getById(id);
        if (plan.result !== 1) return plan;

        const result = await this.repository.delete(plan.data);
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(plan);

        return consequencer.error(`() plan[${id}] failure`);
    }
}
