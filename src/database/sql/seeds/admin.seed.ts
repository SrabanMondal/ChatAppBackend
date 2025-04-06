import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
export async function seedAdmin(datasource: DataSource) {
  const userRepo = datasource.getRepository(User);
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
  } else {
    console.log('Admin testadmin already exists');
  }
}
