import { MigrationInterface, QueryRunner } from "typeorm";

export class Reportmachine1705581729888 implements MigrationInterface {
  name = "Reportmachine1705581729888";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop default value and set the column as NOT NULL for new data
    await queryRunner.query(
      `ALTER TABLE "cultivation" ALTER COLUMN "date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cultivation" ALTER COLUMN "date" DROP DEFAULT`,
    );

    // Step 2: Update the existing 'null' values with a default location (modify as needed)
    await queryRunner.query(
      `UPDATE "farm" SET "location" = COALESCE("location", '(0,0)')`,
    );

    // Step 3: Alter the column to be NOT NULL
    await queryRunner.query(
      `ALTER TABLE "farm" ALTER COLUMN "location" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the steps
    await queryRunner.query(
      `ALTER TABLE "farm" ALTER COLUMN "location" DROP NOT NULL`,
    );

    // It's not possible to reliably restore the default values or distinguish them from updated values
    // If you had a specific default, you would need to know that and use it here

    // Optional: Set a default if needed
    // await queryRunner.query(`ALTER TABLE "farm" ALTER COLUMN "location" SET DEFAULT '(0,0)'`);

    await queryRunner.query(
      `ALTER TABLE "cultivation" ALTER COLUMN "date" SET DEFAULT CURRENT_DATE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cultivation" ALTER COLUMN "date" DROP NOT NULL`,
    );
  }
}
