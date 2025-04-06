import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1742660887755 implements MigrationInterface {
  name = 'CreateUsersTable1742660887755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`isVerified\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`verificationOtp\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`resetPasswordOtp\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`resetPasswordOtp\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`verificationOtp\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isVerified\``);
  }
}
