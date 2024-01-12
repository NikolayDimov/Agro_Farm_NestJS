// validation.pipe.ts
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import * as uuidValidate from "uuid-validate";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0 || !this.isUUID(value)) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [Boolean, Number, String, Array, Object];

    return !types.some(
      (type) => metatype === type || metatype.prototype instanceof type,
    );
  }

  private isUUID(value: any): boolean {
    return uuidValidate(value);
  }
}
