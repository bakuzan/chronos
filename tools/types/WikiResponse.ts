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

export interface WikiResponse extends Record<DataType, WikiEvent[]> {
  wikipedia: string;
  date: string;
}
