import { IsNotEmpty } from "class-validator";

export class CreateExamDto {
    @IsNotEmpty({ message: "name không được trống" })
    name: string;
    @IsNotEmpty({ message: "category không được trống" })
    category: string;
    @IsNotEmpty({ message: "level không được trống" })
    level: string;
}
