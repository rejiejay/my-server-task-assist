import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    /**
     * 处理跨域
     * 注意: 本地环境
     */
    app.enableCors();

    await app.listen(1932);
}
bootstrap();
