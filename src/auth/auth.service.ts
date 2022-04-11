import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAccessToken, JwtPayload } from './models/jwt-payload.model';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCreateUser: AuthCreateUserDto): Promise<void> {
    return await this.userRepository.createUser(authCreateUser);
  }

  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<JwtAccessToken> {
    const user = await this.userRepository.findOne({ username });

    if (user && (await compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Username or Password do not match');
  }
}
