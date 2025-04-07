"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUser = seedUser;
const user_entity_1 = require("../entity/user.entity");
const bcrypt = require("bcrypt");
async function seedUser(datasource) {
    const userRepo = datasource.getRepository(user_entity_1.User);
    const user = await userRepo.findOneBy({ email: 'test@example.com' });
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test@1234', salt);
        const testuser = userRepo.create({
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword,
            role: 'user',
        });
        await userRepo.save(testuser);
        console.log('User testuser created');
    }
    else {
        console.log('User testuser already exists');
    }
}
//# sourceMappingURL=user.seed.js.map