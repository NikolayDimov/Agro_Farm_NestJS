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
import { MultiPolygon, Position } from "geojson";
import { Farm } from "../farm/farm.entity";
import { Soil } from "../soil/soil.entity";

@Entity()
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "jsonb", nullable: true })
  polygons: MultiPolygon | Position[][][];

  @CreateDateColumn({ type: "timestamp" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted: Date;

  // @ManyToOne(() => User, (user) => user.farms)
  // user: User;

  @ManyToOne(() => Farm, (farm) => farm.fields)
  @JoinColumn({ name: "farm_id" })
  farm: Farm;

  // If there is two-way connection between field and soil
  // soil_id is in filed table
  // but also from soil table can reach many fields
  @ManyToOne(() => Soil, (soil) => soil.fields)
  @JoinColumn({ name: "soil_id" })
  soil: Field;

  // If there is one-way connection between field and soil
  // soil_id is in filed table
  // @ManyToOne(() => Soil, (soil) => soil.id)
  // @JoinColumn({ name: "soil_id" })
  // soil: Field;
}
