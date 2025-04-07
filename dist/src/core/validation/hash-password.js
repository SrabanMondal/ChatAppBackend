"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashPassword = void 0;
const bcrypt = require("bcrypt");
class HashPassword {
    async transform(value) {
        const salt = await bcrypt.genSalt(10);
        value.password = await bcrypt.hash(value.password, salt);
        return value;
    }
}
exports.HashPassword = HashPassword;
//# sourceMappingURL=hash-password.js.map