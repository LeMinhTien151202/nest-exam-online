import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { RolesService } from 'src/roles/roles.service';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
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

  async login(user: IUser,response: Response) {
    console.log('USER ROLE before sign:', user.role);
    const { _id, name, email, role, permissions } = user;
    const payload = {
    sub: _id,
    iss: 'from server',
    _id,
    name,
    email,
    role, // Thêm dòng này
  };
    const refresh_token = this.createRefreshToken(payload);
    //update refresh token to db
    await this.usersService.updateUserToken(_id, refresh_token);

    //set refresh token to httpOnly cookie
    response.cookie('refresh_token', refresh_token,
       {
      httpOnly: true,
      maxAge: 60000000,
    }
  );
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
           user:{
             _id,
            name,
            email,
            role,
            permissions
           }
        };
  }
  createRefreshToken = (payload : any)=> {
    const refresh_token = this.jwtService.sign(payload,{
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      // expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES'))/1000,
      expiresIn: '1d',
    });
    return refresh_token;
  }

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
       let uertest = this.jwtService.verify(refreshToken,{
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      console.log("usertest",uertest);
      let user = await this.usersService.findUserByToken(refreshToken);
      if(user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: "token login",
          iss: "from server",
          _id,
          name,
          email,
          role
        };
        const refresh_token = this.createRefreshToken(payload);
        //update refresh token to db
        await this.usersService.updateUserToken(_id.toString(), refresh_token);
        const userRole = user.role as unknown as {_id : string, name : string};
        const temp = await this.rolesService.findOne(userRole._id);
        //set refresh token to httpOnly cookie
        response.clearCookie('refresh_token');

        response.cookie('refresh_token', refresh_token,
          {
            httpOnly: true,
            //thời gian tồn tại của cookie
            // maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
            maxAge: 60000 * 60 * 24 * 7,
          }
        );
        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          user: {
            _id,
            name,
            email,
            role,
            permissions : temp?.permissions
          }
        };
      } else {
        throw new BadRequestException('Token không hợp lệ');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token không hợp lệ hoặc hết hạn');
    }
  }

  async logout(user: IUser, response: Response) {
    await this.usersService.updateUserToken(user._id.toString(),"");
    response.clearCookie('refresh_token');
    return "ok";
  }

  async register(registerUserDto : RegisterUserDto) {
    const IsEmail = await this.usersService.findOneByUsername(registerUserDto.email);
    if(IsEmail) {
      throw new BadRequestException(`Email ${registerUserDto.email} đã tồn tại`);
    }
    const user = await this.usersService.register({...registerUserDto });
    return {
      id: user?._id,
      createdAt: user?.createdAt,
    };
  }
}
