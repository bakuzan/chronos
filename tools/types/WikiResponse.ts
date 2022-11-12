export interface WikipediaLink {
  title: string;
  wikipedia: string;
}

export interface WikiEvent {
  year: string;
  description: string;
  wikipedia: WikipediaLink[];
}

export interface WikiResponse {
  wikipedia: string;
  date: string;
  events: WikiEvent[];
}
