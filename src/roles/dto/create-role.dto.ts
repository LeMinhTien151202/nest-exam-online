import { IsBoolean, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;
    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;
    @IsNotEmpty({ message: 'active không được để trống' })
    @IsBoolean({ message: 'active không đúng định dạng' })
    isActive: boolean;

    // @IsNotEmpty({ message: 'module khong duoc de trong' })
    // @IsArray({ message: ' khong phai mang' })
    // permissions: mongoose.Schema.Types.ObjectId[];
}
