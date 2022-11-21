import db from './database';
import { HistoryEventWithRelatedLinks } from './types/HistoryEventWithRelatedLinks';

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

export function getEventById(
  id: string | undefined
): HistoryEventWithRelatedLinks | null {
  const itemId = id && id.trim() ? Number(id.trim()) : null;

  if (!itemId) {
    return null;
  }

  const historyEvent = db
    .prepare(
      `SELECT * 
         FROM HistoryEvent 
        WHERE id = ?`
    )
    .get(itemId);

  if (historyEvent) {
    const relatedLinks = db
      .prepare(
        `SELECT rl.* 
           FROM RelatedLinks rl 
           JOIN HistoryEventRelatedLink x ON rl.id = x.relatedLinkId
          WHERE x.id = ?`
      )
      .all(itemId);

    if (relatedLinks) {
      historyEvent.relatedLinks = relatedLinks;
    }
  }

  return historyEvent;
}
