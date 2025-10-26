import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSSION } from 'src/decorator/customize';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    //lấy các route được đánh dấu là public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request : Request = context.switchToHttp().getRequest();

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("token không hợp lệ/ không có token");
    }
    const targetMethod = request.method;
    const targetEndPoint = request.route?.path as string;
    const permissions = user?.permissions ?? [];
    let isExist = permissions.find((permission) => {
      return permission.apiPath === targetEndPoint && permission.method === targetMethod;
    })
    if(targetEndPoint.startsWith("/api/v1/auth")) {
      isExist = true;
    }
    if(targetEndPoint.startsWith("/api/v1/subscribers")) {
      isExist = true;
    }
    if(!isExist && !isSkipPermission) {
      throw new ForbiddenException("ban khong co quyen truy cap");
    } 
    return user;
  }
}