import { MigrationInterface, QueryRunner } from "typeorm";

export class AddField1705069655943 implements MigrationInterface {
    name = 'AddField1705069655943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "country" RENAME COLUMN "created" TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "country" RENAME COLUMN "created_at" TO "created"`);
    }

}
