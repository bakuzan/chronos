import db from '../database';

import { WikiEvent } from '../types/WikiResponse';
import { HistoryEvent } from '../types/HistoryEvent';
import { HistoryEventRelatedLink } from '../types/HistoryEventRelatedLink';
import baseProcessor from './baseProcessor';

function clearExistingRecords(month: number, day: number) {
  // Check database for existing records
  const events: HistoryEvent[] = db
    .prepare(
      `SELECT * 
         FROM Death 
        WHERE month = @month 
          AND day = @day`
    )
    .all({ month, day });

  if (!events.length) {
    return; // No events, nothing to do.
  }

  const eventIds = events.map((x) => x.id);
  const questionMarks = eventIds.map(() => '?').join(',');
  const eventRelatedLinks: HistoryEventRelatedLink[] = db
    .prepare(
      `SELECT * 
         FROM DeathRelatedLink
        WHERE deathId IN (${questionMarks})`
    )
    .all(eventIds);

  // Delete existing records so they can be reinserted.
  const deleteLink = db.prepare(
    `DELETE FROM DeathRelatedLink 
      WHERE deathId = @deathId
        AND relatedLinkId = @relatedLinkId`
  );
  const deleteEvent = db.prepare(`DELETE FROM Death WHERE id = ?`);

  const deleteExistingRecords = db.transaction(
    (links: HistoryEventRelatedLink[], evIds: number[]) => {
      for (const herl of links) {
        deleteLink.run(herl);
      }

      for (const heId of evIds) {
        deleteEvent.run(heId);
      }
    }
  );

  deleteExistingRecords(eventRelatedLinks, eventIds);
}

export default function processEvents(
  month: number,
  day: number,
  events: WikiEvent[]
) {
  clearExistingRecords(month, day);

  const insertEvent = db.prepare(`
        INSERT INTO Death(year,month,day,description) 
        VALUES(@year,@month,@day,@description)`);

  const insertEventRelatedLink = db.prepare(`
        INSERT INTO DeathRelatedLink(deathId, relatedLinkId) 
        VALUES(@eventId,@relatedLinkId)`);

  baseProcessor(month, day, events, insertEvent, insertEventRelatedLink);
}
