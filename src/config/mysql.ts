import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

import { TaskAssisUser } from 'src/module/user/entity/user.entity';
import { TaskAssisMap } from 'src/module/map/entity/map.entity';
import { TaskAssisTask } from 'src/module/task/entity/task.entity';
import { TaskAssisWhy } from 'src/module/why/entity/why.entity';
import { TaskAssisPlan } from 'src/module/plan/entity/plan.entity';
import { RequireAssisMind } from 'src/module/mind/entity/mind.entity';

export const mysqlConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'Rejiejay',
    password: 'QQ1938167',
    database: 'task_assist',
    entities: [
        TaskAssisUser,
        TaskAssisMap,
        TaskAssisTask,
        TaskAssisWhy,
        TaskAssisPlan,
        RequireAssisMind
    ],
    synchronize: true,
}