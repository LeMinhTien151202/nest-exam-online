import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: "name không được trống" })
    name: string;
    @IsNotEmpty({ message: "apiPath không được trống" })
    apiPath: string;
    @IsNotEmpty({ message: "method không được trống" })
    method: string;
    @IsNotEmpty({ message: "module không được trONGL" })
    module: string;
}
