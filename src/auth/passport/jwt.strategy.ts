import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
// import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService,
    private readonly rolesService: RolesService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
    console.log('JWT_SECRET:', configService.get('JWT_ACCESS_TOKEN_SECRET'));
  }
  

  async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        console.log('JWT PAYLOAD:', payload); // debug

  // Kiểm tra xem role là object hay string
  const roleId = typeof role === 'object' ? role._id : role;
        //them permissions
        const userRole = role as unknown as {_id : string, name : string};
        const temp = (await this.rolesService.findOne(userRole._id)).toObject();
        //req.user
        return {
            _id,
            name,
            email,
            role,
            permissions : temp?.permissions ?? []
        };
    }

}