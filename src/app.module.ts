import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    /**
     * 问题: AppModule 有什么作用?
     * 猜测: 重点是 @Module 装饰类, 作为 class AppModule  是 export
     */
}
