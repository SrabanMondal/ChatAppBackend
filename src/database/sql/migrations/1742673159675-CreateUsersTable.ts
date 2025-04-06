import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1742673159675 implements MigrationInterface {
  name = 'CreateUsersTable1742673159675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`verificationExprires\` \`verificationExpires\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`verificationExpires\` \`verificationExprires\` datetime NULL`,
    );
  }
}
