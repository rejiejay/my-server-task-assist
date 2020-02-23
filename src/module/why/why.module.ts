import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskAssisWhy } from './entity/why.entity';
import { WhyController } from './why.controller';
import { WhyService } from './why.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssisWhy])],
    controllers: [WhyController],
    providers: [WhyService],
    exports: [WhyService]
})
export class WhyModule { }
