import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Delete, Get, Req, Res } from '@nestjs/common/decorators';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { LoginUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auths')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly rolesService: RolesService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  @ResponseMessage('Login successfully')
  handleLogin(@Req() req,@Res({ passthrough: true }) response: Response,@Body() loginUserDto : LoginUserDto) {
    return this.authService.login(req.user, response);
  }

  @Post('/register')
  @Public()
  @ResponseMessage('Register successfully')
  handleRegister(@Body() registerUserDto : RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Public()
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @ResponseMessage('Lấy thông tin tài khoản thành công')
  @Get('/account')
  async handleGetAccount(@User() user: IUser)  {
    const temp = await this.rolesService.findOne(user.role._id) as any;
    user.permissions = temp.permissions;
    return { user };
  }

  @ResponseMessage('Lấy thông tin tài khoản thành công')
  @Get('/refresh')
  handleGetRefreshToken(@Req() request: Request,
  @Res({ passthrough: true }) response: Response)  {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('đăng xuất thành công')
  @Delete('/logout')
  handleLogout(@User() user: IUser,
  @Res({ passthrough: true }) response: Response)  {
    return this.authService.logout(user, response);
  }


}
