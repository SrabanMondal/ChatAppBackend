"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1744047906348 = void 0;
class CreateUsersTable1744047906348 {
    name = 'CreateUsersTable1744047906348';
    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isVerified\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`verificationOtp\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`verificationExpires\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetPasswordOtp\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetPasswordExpires\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_f4af5b76b36036a609b31e22ea\` ON \`user\` (\`verificationOtp\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_1913ba03c6cc6453978fa7972f\` ON \`user\` (\`verificationExpires\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_a86420b06e5fc63b39fc44987f\` ON \`user\` (\`resetPasswordOtp\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_5e7efe552d0e777ef1c0889b9e\` ON \`user\` (\`resetPasswordExpires\`)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_5e7efe552d0e777ef1c0889b9e\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a86420b06e5fc63b39fc44987f\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_1913ba03c6cc6453978fa7972f\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_f4af5b76b36036a609b31e22ea\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetPasswordExpires\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetPasswordOtp\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`verificationExpires\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`verificationOtp\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isVerified\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\` (\`email\`)`);
    }
}
exports.CreateUsersTable1744047906348 = CreateUsersTable1744047906348;
//# sourceMappingURL=1744047906348-CreateUsersTable.js.map