import { ConflictException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser({
    username,
    password,
    name,
    lastname,
  }: AuthCreateUserDto): Promise<void> {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const user = this.create({
      username,
      password: hashedPassword,
      name,
      lastname,
    });

    try {
      await this.save(user);
    } catch (e) {
      // duplicate user
      if (e.code === '23505')
        throw new ConflictException('Username already exists');
      throw new Error(e);
    }
  }
}
