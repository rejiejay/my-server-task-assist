import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MapModule } from './module/map/map.module';
import { TaskModule } from './module/task/task.module';
import { WhyModule } from './module/why/why.module';
import { PlanModule } from './module/plan/plan.module';
import { MindModule } from './module/mind/mind.module';

import { mysqlConfig } from './config/mysql';

@Module({
    imports: [
        UserModule,
        MapModule,
        TaskModule,
        WhyModule,
        PlanModule,
        MindModule,
        TypeOrmModule.forRoot(mysqlConfig)
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    /**
     * 问题: AppModule 有什么作用?
     * 猜测: 重点是 @Module 装饰类, 作为 class AppModule  是 export
     */
}
