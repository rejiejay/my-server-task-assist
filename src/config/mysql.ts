import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

import { TaskAssisUser } from 'src/module/user/entity/user.entity';
import { TaskAssisMap } from 'src/module/map/entity/map.entity';

export const mysqlConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'DFqew=1938167',
    database: 'task_assist',
    entities: [TaskAssisUser, TaskAssisMap],
    synchronize: true,
}