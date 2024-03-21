import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { installInstrumentation } from '@ambigbank/instrumentation';

installInstrumentation({ serviceName: 'users' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AM BigBank Users Microservice API')
    .setDescription('The BigBank Users Microservice API description')
    .setVersion('1.0')
    .addTag('users', 'Users')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  const port = configService.get('port');
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
