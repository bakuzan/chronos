import db from './database';

export function getBirthsForDate(month: number, day: number) {
  return db
    .prepare(
      `SELECT * 
         FROM Birth 
        WHERE month = @month 
          AND day = @day`
    )
    .all({ month, day });
}

export function getDeathsForDate(month: number, day: number) {
  return db
    .prepare(
      `SELECT * 
         FROM Death 
        WHERE month = @month 
          AND day = @day`
    )
    .all({ month, day });
}

export function getEventsForDate(month: number, day: number) {
  return db
    .prepare(
      `SELECT * 
         FROM HistoryEvent 
        WHERE month = @month 
          AND day = @day`
    )
    .all({ month, day });
}
