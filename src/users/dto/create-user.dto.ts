import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "name không được trống"})
    name: string;
    @IsEmail({},{message: "email không đúng định dạng"})
    @IsNotEmpty({message: "email không được trống 11"})
    @IsOptional()
    email?: string;
    @IsNotEmpty({message: "password không được trống"})
    password: string;
    @IsNotEmpty({message: "phone không được trONGL"})
    phone: string;
    @IsNotEmpty({message: "age không được trống"})
    age: number;
    @IsNotEmpty({message: "gender không được trONGL"})
    gender: string;
    @IsNotEmpty({message: "address không được trống"})
    address: string;
    // @IsNotEmpty({message: "role không được trống"})
    // @IsMongoId({message: "role khong dung dinh dang"})
    // role: mongoose.Schema.Types.ObjectId;

}
