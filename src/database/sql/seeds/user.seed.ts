import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
export async function seedUser(datasource: DataSource) {
  const userRepo = datasource.getRepository(User);
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
  } else {
    console.log('User testuser already exists');
  }
}
