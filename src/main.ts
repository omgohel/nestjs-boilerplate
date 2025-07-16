import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document); // Accessible at /docs

  const port = 3000;
  await app.listen(port);

  console.log("\n🚀 Server is up and running!");
  console.log(`🔗 Listening on: http://localhost:${port}`);
  console.log("📘 Swagger docs available at: /docs");
  console.log("✅ Database connected successfully\n");
}
bootstrap();
