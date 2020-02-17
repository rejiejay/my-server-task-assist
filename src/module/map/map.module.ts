import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskAssisMap } from './entity/map.entity';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssisMap])],
    controllers: [MapController],
    providers: [MapService],
    exports: [MapService]
})
export class MapModule { }
