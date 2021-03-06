import {
  ConflictException,
  DynamicModule,
  Logger,
  Module,
} from '@nestjs/common';
import { connect, listSchemas, Schema } from '@mongozilla/mongozilla';
import { MongoClientOptions } from 'mongodb';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { APP_FILTER } from '@nestjs/core';
import { MongoZillaExceptionHandler } from './mongozilla.exception-handler';
import {FindManyEntityPipe, FindOneEntityPipe, TransformEntityPipe} from "./pipes";

type MongoZillaConnection = MongoClientOptions & { uri: string; name?: string };

@Module({})
export class MongoZillaModule {
  static forRoot(options: MongoZillaConnection): DynamicModule;
  static forRoot(connections: MongoZillaConnection[]): DynamicModule;
  static forRoot(
    options: MongoZillaConnection | MongoZillaConnection[],
  ): DynamicModule {
    const connectionProviderName = (name = 'default') =>
      `MongoZillaConnection-${name}`;
    const connections: MongoZillaConnection[] = Array.isArray(options)
      ? options
      : [options];
    const connectionProviders: Provider[] = connections.map((options) => ({
      provide: connectionProviderName(options.name),
      async useFactory() {
        return connect(options);
      },
    }));

    return {
      module: MongoZillaModule,
      global: true,
      providers: [
        ...connectionProviders,
        {
          provide: 'MongoZillaSchemaValidator',
          inject: connections.map(({ name }) => connectionProviderName(name)),
          async useFactory() {
            const logger = new Logger('MongoZilla-Module');
            const schemas: Schema<any>[] = listSchemas();

            for (const schema of schemas) {
              if (!schema.isValid()) {
                throw new ConflictException(
                  `MongoZilla-SchemaValidator: Schema for entity '${
                    schema.getEntityClass().name
                  }' is invalid. Please check docs ...`,
                );
              }
            }

            logger.log(`Mapped ${schemas.length} entities.`);
          },
        },
        {
          provide: APP_FILTER,
          useClass: MongoZillaExceptionHandler,
        },
          FindOneEntityPipe,
          FindManyEntityPipe,
          TransformEntityPipe
      ],
      exports: [
        FindOneEntityPipe,
        FindManyEntityPipe,
        TransformEntityPipe
      ]
    };
  }
}
