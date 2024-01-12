import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTable1705054383151 implements MigrationInterface {
  name = "AddNewTable1705054383151";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "field" ADD "test" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "test"`);
  }
}
