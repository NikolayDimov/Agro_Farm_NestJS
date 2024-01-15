import { MigrationInterface, QueryRunner } from "typeorm";

export class Boundary1705327226646 implements MigrationInterface {
    name = 'Boundary1705327226646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" RENAME COLUMN "polygons" TO "boundary"`);
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "boundary" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" ALTER COLUMN "boundary" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "field" RENAME COLUMN "boundary" TO "polygons"`);
    }

}
