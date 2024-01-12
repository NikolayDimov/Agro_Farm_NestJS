import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { Country } from "../country/country.entity";
import { Field } from "../field/field.entity";
// import { Machine } from "../machine/machine.entity";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // Connect to the user - not for our project
  // @ManyToOne(() => User, (user) => user.farms)
  // user: User;

  @ManyToOne(() => Country, (country) => country.farms)
  @JoinColumn({ name: "country_id" })
  country: Country;

  // @OneToMany(() => Machine, (machine) => machine.farm)
  // machines: Machine[];

  @OneToMany(() => Field, (field) => field.farm)
  fields: Field[];

  @CreateDateColumn({ type: "timestamp" })
  created: Date;

  @UpdateDateColumn({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP" })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted: Date;
}
