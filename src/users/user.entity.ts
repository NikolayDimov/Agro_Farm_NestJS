import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Report } from "../reports/report.entity";
// import { Farm } from '../farm/farm.entity';

enum UserRole {
    OWNER = "OWNER",
    OPERATOR = "OPERATOR",
    VIEWER = "VIEWER",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.VIEWER, enumName: "user_role" })
    role: UserRole;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    // @OneToMany(() => Farm, (farm) => farm.user)
    // farms: Farm[];

    @AfterInsert()
    logInsert() {
        console.log("Inserted User with id", this.id, "and role", this.role);
    }

    @AfterUpdate()
    logUpdate() {
        console.log("Updated User with id", this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log("Removed User with id", this.id);
    }
}
