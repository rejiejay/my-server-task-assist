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

}
