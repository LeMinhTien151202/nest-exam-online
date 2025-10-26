import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService
  ) {}
    async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        const userRole = user.role as unknown as {_id : string, name : string};
        const temp = await this.rolesService.findOne(userRole._id);
        const objUser = {
          ...user.toObject(),
          permissions : temp?.permissions ?? []
        }
        return objUser;
      }
    }
    return null;
  }

  async login(user: IUser) {
    console.log('USER ROLE before sign:', user.role);
    const { _id, name, email, role, permissions } = user;
    const payload = {
    sub: _id,
    iss: 'from server',
    _id,
    name,
    email,
    role, // ✅ Thêm dòng này
  };
    // const refresh_token = this.createRefreshToken(payload);
    // //update refresh token to db
    // await this.usersService.updateUserToken(_id, refresh_token);

    //set refresh token to httpOnly cookie
//     response.cookie('refresh_token', refresh_token,
//        {
//       httpOnly: true,
//       maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
//     }
//   );
        return {
            access_token: this.jwtService.sign(payload),
           user:{
             _id,
            name,
            email,
            role,
            permissions
           }
        };
  }

//   async register(registerUserDto : RegisterUserDto) {
//     const IsEmail = await this.usersService.findOneByUsername(registerUserDto.email);
//     if(IsEmail) {
//       throw new BadRequestException(`Email ${registerUserDto.email} đã tồn tại`);
//     }
//     const user = await this.usersService.register({...registerUserDto });
//     return {
//       id: user?._id,
//       createdAt: user?.createdAt,
//     };
//   }
}
