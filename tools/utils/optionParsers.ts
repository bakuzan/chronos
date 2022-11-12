import { InvalidArgumentError } from 'commander';
import { isDataType } from '../constants/DataType';

export function myParseInt(value: string) {
  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }

  return parsedValue;
}

export function myParseDataType(value: string) {
  if (isDataType(value)) {
    return value;
  }

  throw new InvalidArgumentError('Not a valid mode.');
}
