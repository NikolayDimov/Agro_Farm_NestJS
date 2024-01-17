import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Farm } from "../farm/farm.entity";
import { Cultivation } from "../cultivation/cultivation.entity";

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

  @OneToMany(() => Cultivation, (cultivation) => cultivation.machine)
  cultivations: Cultivation[];

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created: Date;

  @UpdateDateColumn({
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at", nullable: true })
  deleted: Date;
}
