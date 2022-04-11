import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAccessToken } from './models/jwt-payload.model';

@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCreateUser: AuthCreateUserDto): Promise<void> {
    return await this.authSevice.signUp(authCreateUser);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<JwtAccessToken> {
    return await this.authSevice.signIn(authCredentials);
  }
}
