import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { Farm } from "../farm/farm.entity";
import { Soil } from "../soil/soil.entity";

@Entity()
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  polygons: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted: Date;

  // @ManyToOne(() => User, (user) => user.farms)
  // user: User;

  @ManyToOne(() => Farm, (farm) => farm.fields)
  @JoinColumn({ name: "farm_id" })
  farm: Farm;

  @ManyToOne(() => Soil, (soil) => soil.fields)
  @JoinColumn({ name: "soil_id" })
  soil: Field;
}
