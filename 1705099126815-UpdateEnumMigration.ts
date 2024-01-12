import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnumMigration1705099126815 implements MigrationInterface {
    name = 'UpdateEnumMigration1705099126815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role" AS ENUM('OWNER', 'OPERATOR', 'VIEWER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role" NOT NULL DEFAULT 'VIEWER', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "country_id" uuid, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f306910b05e2d54ed972a536a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "growing_period" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "field_id" uuid, "crop_id" uuid, CONSTRAINT "PK_d2233e049d26c9fab82e840cc08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "polygons" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "farm_id" uuid, "soil_id" uuid, CONSTRAINT "PK_39379bba786d7a75226b358f81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "soil" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_bc7efbd307095fd17ebeec730de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "machine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "register_number" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "farm_id" uuid, CONSTRAINT "PK_acc588900ffa841d96eb5fd566c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cultivation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "growing_period_id" uuid, "cultivation_type_id" uuid, "machine_id" uuid, CONSTRAINT "PK_4cc4355a3e4865a33d580692b71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cultivation_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_38054f128b9aa3e61e0623eb555" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_91b78829fbeeb785832e5c436f7" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "growing_period" ADD CONSTRAINT "FK_460299a980efb9105670ab6bafd" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "growing_period" ADD CONSTRAINT "FK_2f77d8caea966b4830d90473eee" FOREIGN KEY ("crop_id") REFERENCES "crop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_725288d262a578ffe1d8d1c77d4" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_b0b5c163d6cebfcddb7e79a975b" FOREIGN KEY ("soil_id") REFERENCES "soil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "machine" ADD CONSTRAINT "FK_f72ffd2c2caadb0f43792b882bc" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivation" ADD CONSTRAINT "FK_db478d632e2534f14ce16529412" FOREIGN KEY ("growing_period_id") REFERENCES "growing_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivation" ADD CONSTRAINT "FK_fb5c5c0e1720c11b3830b4c3bbb" FOREIGN KEY ("cultivation_type_id") REFERENCES "cultivation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivation" ADD CONSTRAINT "FK_9ab636f9e6b9141db977bdf8f04" FOREIGN KEY ("machine_id") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivation" DROP CONSTRAINT "FK_9ab636f9e6b9141db977bdf8f04"`);
        await queryRunner.query(`ALTER TABLE "cultivation" DROP CONSTRAINT "FK_fb5c5c0e1720c11b3830b4c3bbb"`);
        await queryRunner.query(`ALTER TABLE "cultivation" DROP CONSTRAINT "FK_db478d632e2534f14ce16529412"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP CONSTRAINT "FK_f72ffd2c2caadb0f43792b882bc"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_b0b5c163d6cebfcddb7e79a975b"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_725288d262a578ffe1d8d1c77d4"`);
        await queryRunner.query(`ALTER TABLE "growing_period" DROP CONSTRAINT "FK_2f77d8caea966b4830d90473eee"`);
        await queryRunner.query(`ALTER TABLE "growing_period" DROP CONSTRAINT "FK_460299a980efb9105670ab6bafd"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_91b78829fbeeb785832e5c436f7"`);
        await queryRunner.query(`DROP TABLE "cultivation_type"`);
        await queryRunner.query(`DROP TABLE "cultivation"`);
        await queryRunner.query(`DROP TABLE "machine"`);
        await queryRunner.query(`DROP TABLE "soil"`);
        await queryRunner.query(`DROP TABLE "field"`);
        await queryRunner.query(`DROP TABLE "growing_period"`);
        await queryRunner.query(`DROP TABLE "crop"`);
        await queryRunner.query(`DROP TABLE "farm"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role"`);
    }

}
