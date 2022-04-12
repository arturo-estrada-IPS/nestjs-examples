import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async createUser(createUserDto: AuthCreateUserDto): Promise<void> {
    const { username, password, name, lastname } = createUserDto;
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
    } catch (error) {
      this.logger.error(
        `Failed to create user ${JSON.stringify(createUserDto)}`,
        error.stack,
      );
      // duplicate user
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      throw new InternalServerErrorException();
    }
  }
}
