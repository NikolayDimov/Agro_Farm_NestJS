import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Farm } from "../farm/farm.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  // @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  // created: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted: Date;

  @OneToMany(() => Farm, (farm) => farm.country)
  farms: Farm[];
}
