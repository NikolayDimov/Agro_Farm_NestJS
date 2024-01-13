import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedAt1705149117057 implements MigrationInterface {
    name = 'CreatedAt1705149117057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "deleted" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "deleted" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
