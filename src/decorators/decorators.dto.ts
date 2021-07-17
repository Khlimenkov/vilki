import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as validator from 'class-validator';
import { IApiString } from './decorators.interfaces';

export const IsString = ({ minLenght, example }: IApiString) =>
  applyDecorators(
    ApiProperty({ type: 'string', example: example }),
    validator.IsString(),
    validator.MinLength(minLenght),
  );

export const IsOptionalString = ({ minLenght, example }: IApiString) =>
  applyDecorators(
    ApiProperty({ type: 'string', example: example }),
    validator.IsOptional(),
    validator.IsString(),
    validator.MinLength(minLenght),
  );

export const IsEmail = ({ minLenght, example }: IApiString) =>
  applyDecorators(
    ApiProperty({ type: 'string', example: example }),
    validator.IsEmail(),
    validator.MinLength(minLenght),
  );

export const IsOptionalEmail = ({ minLenght, example }: IApiString) =>
  applyDecorators(
    ApiProperty({ type: 'string', example: example }),
    validator.IsOptional(),
    validator.IsEmail(),
    validator.MinLength(minLenght),
  );
