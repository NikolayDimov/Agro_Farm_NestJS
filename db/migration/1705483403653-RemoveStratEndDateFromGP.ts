import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveStratEndDateFromGP1705483403653
  implements MigrationInterface
{
  name = "RemoveStratEndDateFromGP1705483403653";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop "startDate" and "endDate" columns from "growing_period"
    await queryRunner.query(
      `ALTER TABLE "growing_period" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "growing_period" DROP COLUMN "endDate"`,
    );

    // Step 2: Update "date" column in "cultivation" to remove null values
    await queryRunner.query(
      `UPDATE "cultivation" SET "date" = '2024-01-01' WHERE "date" IS NULL`,
    );

    // Step 3: Alter "date" column in "cultivation" to NOT NULL
    await queryRunner.query(
      `ALTER TABLE "cultivation" ALTER COLUMN "date" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Revert "date" column in "cultivation" to nullable
    await queryRunner.query(
      `ALTER TABLE "cultivation" ALTER COLUMN "date" DROP NOT NULL`,
    );

    // Step 2: Revert "startDate" and "endDate" columns in "growing_period"
    await queryRunner.query(
      `ALTER TABLE "growing_period" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "growing_period" ADD "endDate" date NOT NULL`,
    );

    // IMPORTANT: If you're adding new columns or modifying existing columns in this step,
    // make sure to provide default values or handle existing data accordingly.
  }
}
