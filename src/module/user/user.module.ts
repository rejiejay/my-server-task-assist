import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskAssisUser } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssisUser])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
