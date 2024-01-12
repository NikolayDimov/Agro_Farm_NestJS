import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Farm } from "../farm/farm.entity";

@Entity()
export class Machine {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ name: "register_number" })
  registerNumber: string;

  @ManyToOne(() => Farm, (farm) => farm.id)
  @JoinColumn({ name: "farm_id" })
  farm: Farm;

  @CreateDateColumn({ type: "timestamp" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted: Date;
}
