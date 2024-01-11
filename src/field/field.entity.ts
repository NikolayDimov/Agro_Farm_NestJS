import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Country } from '../country/country.entity';
import { Farm } from '../farm/farm.entity';

@Entity()
export class Field {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    polygons: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted: Date;


    // @ManyToOne(() => User, (user) => user.farms)
    // user: User;

    @ManyToOne(() => Farm, (farm) => farm.fields)
    farm: Farm;
}