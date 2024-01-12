import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountryID1705064778855 implements MigrationInterface {
    name = 'AddCountryID1705064778855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_aeb421b0adc7ce3f09f490a415c"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_0a0f7ebfc798343ecae66920c3e"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_0a2e2942fb537db218d58afce9c"`);
        await queryRunner.query(`ALTER TABLE "farm" RENAME COLUMN "countryId" TO "country_id"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "farmId"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "soilId"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "farm_id" uuid`);
        await queryRunner.query(`ALTER TABLE "field" ADD "soil_id" uuid`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_91b78829fbeeb785832e5c436f7" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_725288d262a578ffe1d8d1c77d4" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_b0b5c163d6cebfcddb7e79a975b" FOREIGN KEY ("soil_id") REFERENCES "soil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_b0b5c163d6cebfcddb7e79a975b"`);
        await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_725288d262a578ffe1d8d1c77d4"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_91b78829fbeeb785832e5c436f7"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "soil_id"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "farm_id"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "soilId" uuid`);
        await queryRunner.query(`ALTER TABLE "field" ADD "farmId" uuid`);
        await queryRunner.query(`ALTER TABLE "farm" RENAME COLUMN "country_id" TO "countryId"`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_0a2e2942fb537db218d58afce9c" FOREIGN KEY ("soilId") REFERENCES "soil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field" ADD CONSTRAINT "FK_0a0f7ebfc798343ecae66920c3e" FOREIGN KEY ("farmId") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_aeb421b0adc7ce3f09f490a415c" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
