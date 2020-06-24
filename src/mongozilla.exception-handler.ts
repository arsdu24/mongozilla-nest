import {
  ArgumentsHost,
  Catch,
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ConnectionNotFoundException,
  EntityNotFoundException,
  MongoZillaException,
} from '@mongozilla/mongozilla';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(MongoZillaException)
export class MongoZillaExceptionHandler extends BaseExceptionFilter {
  async catch(exception: MongoZillaException<any>, host: ArgumentsHost) {
    const errorContext = {
      context: exception.context,
      entity: exception.entity.name,
      message: exception.message,
    };

    let error: Error;

    switch (true) {
      case exception instanceof ConnectionNotFoundException:
        error = new ConflictException(
          errorContext,
          'ConnectionNotFoundException',
        );
        break;
      case exception instanceof EntityNotFoundException:
        error = new UnprocessableEntityException(
          errorContext,
          'ConnectionNotFoundException',
        );
        break;

      default:
        error = new InternalServerErrorException(errorContext);
    }

    return super.catch(error, host);
  }
}
