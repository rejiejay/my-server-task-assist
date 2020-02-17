import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    /**
     * 处理跨域
     * 注意: 本地环境
     */
    app.enableCors();

    /**
     * 全局拦截器
     * 文档: https://docs.nestjs.cn/6/guards
     */
    app.useGlobalGuards(new AuthGuard());

    await app.listen(1932);
}
bootstrap();
