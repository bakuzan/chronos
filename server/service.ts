import db from './database';

import { resolveId } from './utils';

import { EventItemWithRelatedLinks } from './types/EventItemWithRelatedLinks';

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
): EventItemWithRelatedLinks | null {
  const itemId = resolveId(id);

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
           FROM RelatedLink rl 
           JOIN HistoryEventRelatedLink x ON rl.id = x.relatedLinkId
          WHERE x.historyEventId = ?`
      )
      .all(itemId);

    if (relatedLinks) {
      historyEvent.relatedLinks = relatedLinks;
    }
  }

  return historyEvent;
}

export function getBirthById(
  id: string | undefined
): EventItemWithRelatedLinks | null {
  const itemId = resolveId(id);

  if (!itemId) {
    return null;
  }

  const birthEvent = db
    .prepare(
      `SELECT * 
         FROM Birth 
        WHERE id = ?`
    )
    .get(itemId);

  if (birthEvent) {
    const relatedLinks = db
      .prepare(
        `SELECT rl.* 
           FROM RelatedLink rl 
           JOIN BirthRelatedLink x ON rl.id = x.relatedLinkId
          WHERE x.birthId = ?`
      )
      .all(itemId);

    if (relatedLinks) {
      birthEvent.relatedLinks = relatedLinks;
    }
  }

  return birthEvent;
}

export function getDeathById(
  id: string | undefined
): EventItemWithRelatedLinks | null {
  const itemId = resolveId(id);

  if (!itemId) {
    return null;
  }

  const deathEvent = db
    .prepare(
      `SELECT * 
         FROM Death 
        WHERE id = ?`
    )
    .get(itemId);

  if (deathEvent) {
    const relatedLinks = db
      .prepare(
        `SELECT rl.* 
           FROM RelatedLink rl 
           JOIN DeathRelatedLink x ON rl.id = x.relatedLinkId
          WHERE x.deathId = ?`
      )
      .all(itemId);

    if (relatedLinks) {
      deathEvent.relatedLinks = relatedLinks;
    }
  }

  return deathEvent;
}
