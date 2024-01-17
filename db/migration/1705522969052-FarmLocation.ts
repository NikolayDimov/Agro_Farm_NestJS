import { MigrationInterface, QueryRunner } from "typeorm";

export class FarmLocation1705522969052 implements MigrationInterface {
  name = "FarmLocation1705522969052";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "farm" ADD "location" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "cultivation" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "cultivation" ADD "date" date DEFAULT CURRENT_DATE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cultivation" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "cultivation" ADD "date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "location"`);
  }
}
