import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMig1705101502350 implements MigrationInterface {
  name = "NewMig1705101502350";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "test"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "test" character varying NOT NULL`,
    );
  }
}
