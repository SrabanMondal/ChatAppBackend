"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const user_entity_1 = require("../entity/user.entity");
const bcrypt = require("bcrypt");
async function seedAdmin(datasource) {
    const userRepo = datasource.getRepository(user_entity_1.User);
    const user = await userRepo.findOneBy({ email: 'admin@example.com' });
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@xyz', salt);
        const testuser = userRepo.create({
            username: 'testadmin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });
        await userRepo.save(testuser);
        console.log('Admin testuser created');
    }
    else {
        console.log('Admin testadmin already exists');
    }
}
//# sourceMappingURL=admin.seed.js.map