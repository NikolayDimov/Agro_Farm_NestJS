import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColumnTest1705054635070 implements MigrationInterface {
  name = "RemoveColumnTest1705054635070";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "test"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "field" ADD "test" character varying NOT NULL`,
    );
  }
}
