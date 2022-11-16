import db from './database';

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
