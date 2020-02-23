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
}
