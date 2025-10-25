import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Req, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/customize';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  @ResponseMessage('Login successfully')
  handleLogin(@Req() req,@Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user);
  }

}
