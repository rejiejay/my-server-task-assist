import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskAssisMap } from './entity/map.entity';

@Injectable()
export class MapService {
    constructor(
        @InjectRepository(TaskAssisMap)
        private readonly repository: Repository<TaskAssisMap>,
    ) { }

    async getValue(key: string): Promise<Consequencer> {
        const myMap = await this.repository.findOne({ key });

        if (!myMap) return consequencer.error(`key[${key}] is error`);

        return consequencer.success(myMap);
    }

    async setValue(key: string, value: string): Promise<Consequencer> {
        const myValue = await this.getValue(key);

        if (myValue.result !== 1) return myValue

        const myMap = myValue.data

        const result = await this.repository.update(myMap, { value });

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(result);

        return consequencer.error(`update key[${key}] failure`);
    }
}
