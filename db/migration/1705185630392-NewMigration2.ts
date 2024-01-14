import { MigrationInterface, QueryRunner } from "typeorm"

export class NewMigration21705185630392 implements MigrationInterface {
  name = "NewMigration21705185630392"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }
}
