import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ValidateIf((obj) => obj.name !== undefined) //validate only if field is present
  @IsNotEmpty()
  name?: string;

  @ValidateIf((obj) => obj.email !== undefined)
  @IsEmail()
  email?: string;

  @ValidateIf((obj) => obj.password !== undefined)
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}
