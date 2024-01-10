import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}

// The @Expose() decorator is used to mark class properties that should be exposed during the transformation process. When transforming an object using class-transformer, only the properties marked with @Expose() will be included in the transformation result. This allows you to control which properties are included or excluded during the transformation.
