import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Farm } from "../farm/farm.entity";

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @OneToMany(() => Farm, (farm) => farm.country)
    farms: Farm;
}