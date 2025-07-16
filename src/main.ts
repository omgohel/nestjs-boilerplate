import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { configService } from "./config/config.service";
import "tsconfig-paths/register";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!configService.isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Item API")
        .setDescription("My Item API")
        .build(),
    );

    SwaggerModule.setup("docs", app, document);
  }

  await app.listen(3000);
}
bootstrap();
