const DATA_TYPES = ['events', 'births', 'deaths'] as const;
type DataTypeTuple = typeof DATA_TYPES;

export type DataType = DataTypeTuple[number];

export function isDataType(value: string): value is DataType {
  return DATA_TYPES.includes(value as DataType);
}
