import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequireAssisMind } from './entity/mind.entity';
import { MindController } from './mind.controller';
import { MindService } from './mind.service';

@Module({
    imports: [TypeOrmModule.forFeature([RequireAssisMind])],
    controllers: [MindController],
    providers: [MindService],
    exports: [MindService]
})
export class MindModule { }
