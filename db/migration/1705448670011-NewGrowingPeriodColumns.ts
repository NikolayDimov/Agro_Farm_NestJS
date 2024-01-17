import { MigrationInterface, QueryRunner } from "typeorm";

export class NewGrowingPeriodColumns1705448670011
  implements MigrationInterface
{
  name = "NewGrowingPeriodColumns1705448670011";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Make startDate Nullable
    await queryRunner.query(
      `ALTER TABLE "growing_period" ADD "startDate" date`,
    );

    // Step 2: Set Default Value for Existing Rows
    await queryRunner.query(
      `UPDATE "growing_period" SET "startDate" = CURRENT_DATE WHERE "startDate" IS NULL`,
    );

    // Step 3: Make startDate Not Nullable
    await queryRunner.query(
      `ALTER TABLE "growing_period" ALTER COLUMN "startDate" SET NOT NULL`,
    );

    // Step 4: Repeat the above steps for "endDate"
    await queryRunner.query(`ALTER TABLE "growing_period" ADD "endDate" date`);

    await queryRunner.query(
      `UPDATE "growing_period" SET "endDate" = CURRENT_DATE WHERE "endDate" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "growing_period" ALTER COLUMN "endDate" SET NOT NULL`,
    );

    // Update the "cultivation" table as needed

    // ...
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // The "down" method should reverse the changes made in the "up" method

    // Revert changes for "cultivation" table

    // ...

    // Step 4 (Down): Drop the "endDate" column
    await queryRunner.query(
      `ALTER TABLE "growing_period" DROP COLUMN "endDate"`,
    );

    // Step 3 (Down): Make "startDate" Nullable Again
    await queryRunner.query(
      `ALTER TABLE "growing_period" ALTER COLUMN "startDate" DROP NOT NULL`,
    );

    // Step 2 (Down): Drop Default Value for "startDate"
    await queryRunner.query(
      `UPDATE "growing_period" SET "startDate" = NULL WHERE "startDate" = CURRENT_DATE`,
    );

    // Step 1 (Down): Drop the "startDate" column
    await queryRunner.query(
      `ALTER TABLE "growing_period" DROP COLUMN "startDate"`,
    );

    // Repeat the above steps for "endDate"

    // ...
  }
}
