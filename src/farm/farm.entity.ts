import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Farm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @ManyToOne(() => User, (user) => user.reports)
    user: User;
}