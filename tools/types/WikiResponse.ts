import { DataType } from '../constants/DataType';

export interface WikipediaLink {
  title: string;
  wikipedia: string;
}

export interface WikiEvent {
  year: string;
  description: string;
  wikipedia: WikipediaLink[];
}

export type WikiResponse<propName extends DataType> = {
  wikipedia: string;
  date: string;
} & { [key in propName]: WikiEvent[] };
