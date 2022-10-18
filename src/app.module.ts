import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroeModule } from './heroe/heroe.module';

@Module({
  imports: [
    HeroeModule,
    // Configuración de variables de entorno
    ConfigModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/environments/.env.${process.env.ENV.trim()}`,
      isGlobal: true,
    }),

    // Configuración para conexión con MongoDB a través de Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('NOSQL_URI'),
      }),
    }),

    // Configuración para conexión con PostgreSQL a través de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // entities: [],
        autoLoadEntities: true,
        synchronize: true,
        logging: process.env.ENV === 'production' ? false : true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule{

}
