import { IsNotEmpty } from "class-validator";

export class CreateQuestionDto {
    @IsNotEmpty({message: "name không được trống"})
    content: string;
    @IsNotEmpty({message: "đáp án A không được trống"})
    answerA: string;
    @IsNotEmpty({message: "đáp án B không được trống"})
    answerB: string;
    @IsNotEmpty({message: "đáp án C không được trống"})
    answerC: string;
    @IsNotEmpty({message: "đáp án D không được trống"})
    answerD: string;
    @IsNotEmpty({message: "đáp án chính xác không được trống"})
    answerCorrect: string;
}

