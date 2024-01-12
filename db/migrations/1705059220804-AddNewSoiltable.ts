import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewSoiltable1705059220804 implements MigrationInterface {
  name = "AddNewSoiltable1705059220804";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "soil" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, CONSTRAINT "PK_bc7efbd307095fd17ebeec730de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "field" ADD "soilId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "field" ADD CONSTRAINT "FK_0a2e2942fb537db218d58afce9c" FOREIGN KEY ("soilId") REFERENCES "soil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "field" DROP CONSTRAINT "FK_0a2e2942fb537db218d58afce9c"`,
    );
    await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "soilId"`);
    await queryRunner.query(`DROP TABLE "soil"`);
  }
}
