import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Crop } from "../crop/crop.entity";
import { Field } from "../field/field.entity";
import { Cultivation } from "../cultivation/cultivation.entity";

@Entity()
export class GrowingPeriod {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Field, (field) => field.growingPeriods)
  @JoinColumn({ name: "field_id" })
  field: Field;

  @ManyToOne(() => Crop, (crop) => crop.growingPeriods)
  @JoinColumn({ name: "crop_id" })
  crop: Crop;

  @OneToMany(() => Cultivation, (cultivation) => cultivation.growingPeriod)
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
