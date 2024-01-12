import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTest1705075345551 implements MigrationInterface {
  name = "AddNewTest1705075345551";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "polygons"`);
    await queryRunner.query(`ALTER TABLE "field" ADD "polygons" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "polygons"`);
    await queryRunner.query(
      `ALTER TABLE "field" ADD "polygons" character varying NOT NULL`,
    );
  }
}
