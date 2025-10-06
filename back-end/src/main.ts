import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoginMiddleware } from './middlewares/login/login.middleware';

const logginMiddleware = new LoginMiddleware();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  //Đăng kí middleware
  //app.use(new LoginMiddleware().use.bind(new LoginMiddleware()));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
