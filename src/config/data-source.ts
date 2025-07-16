import "dotenv/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { configService } from "./config.service";

export const AppDataSource = new DataSource({
  ...(configService.getTypeOrmConfig() as DataSourceOptions),
  synchronize: false,
});
