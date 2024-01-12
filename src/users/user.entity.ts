import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
} from "typeorm";
import { UserRole } from "../auth/dtos/enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.VIEWER, enumName: "user_role" })
    role: UserRole;

    // @Column({ default: UserRole.VIEWER })
    // role: UserRole;


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deleted: Date;

    // Not connect user and farm
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

    // @BeforeInsert()
    // setDefaultRole() {
    //     // Set the default role to VIEWER if not provided during user creation
    //     if (!this.role) {
    //         this.role = UserRole.VIEWER;
    //     }
    // }
}
