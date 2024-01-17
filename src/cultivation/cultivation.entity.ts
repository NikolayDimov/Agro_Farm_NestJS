import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Machine } from "../machine/machine.entity";
import { GrowingPeriod } from "../growing-period/growing-period.entity";
import { CultivationType } from "../cultivation-type/cultivation-type.entity";

@Entity()
export class Cultivation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  date: Date;

  @ManyToOne(() => GrowingPeriod, (growingPeriod) => growingPeriod.cultivations)
  @JoinColumn({ name: "growing_period_id" })
  growingPeriod: GrowingPeriod;

  @ManyToOne(
    () => CultivationType,
    (cultivationType) => cultivationType.cultivations,
  )
  @JoinColumn({ name: "cultivation_type_id" })
  cultivationType: CultivationType;

  @ManyToOne(() => Machine, (machine) => machine.cultivations)
  @JoinColumn({ name: "machine_id" })
  machine: Machine;

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
