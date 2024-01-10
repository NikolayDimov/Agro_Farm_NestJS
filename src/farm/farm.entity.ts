import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";
import { Country } from '../country/country.entity';

@Entity()
export class Farm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @ManyToOne(() => User, (user) => user.farms)
    user: User;

    @ManyToOne(() => Country, (country) => country.farms)
    country: Country;
}