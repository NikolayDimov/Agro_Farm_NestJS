import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Country } from "../country/country.entity";
import { Field } from "../field/field.entity";

@Entity()
export class Farm {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted: Date;

    // @ManyToOne(() => User, (user) => user.farms)
    // user: User;

    @ManyToOne(() => Country, (country) => country.farms)
    country: Country;

    @OneToMany(() => Field, (field) => field.farm)
    fields: Field;
}
