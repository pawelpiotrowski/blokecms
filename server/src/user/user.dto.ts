import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppSchemaId } from '../common/common.interface';
import { User } from './user.schema';

@InputType()
export class UserInput {
  @Field(() => String)
  @IsNotEmpty()
  readonly username: string;

  @Field(() => String)
  @IsNotEmpty()
  readonly password: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly createdBy?: string;
}

@InputType()
export class UserInputFilter extends PartialType(User, InputType) {}

@InputType()
export class UserInputUpdate extends PartialType(User, InputType) {
  @Field(() => ID)
  _id: AppSchemaId;

  @Field(() => String, { nullable: true })
  @IsOptional()
  password?: string;
}
