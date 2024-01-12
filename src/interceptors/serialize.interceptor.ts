import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstructor<T> {
  new (...args: []): T;
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializerInterceptor<T>(dto));
}

export class SerializerInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data: T) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
