import db from '../database';

import { WikiEvent, WikiResponse } from '../types/WikiResponse';
import { HistoryEvent } from '../types/HistoryEvent';
import { HistoryEventRelatedLink } from '../types/HistoryEventRelatedLink';

function clearExistingRecords(month: number, day: number) {
  // Check database for existing records
  const historyEvents: HistoryEvent[] = db
    .prepare(
      `SELECT * 
         FROM HistoryEvent 
        WHERE month = @month 
          AND day = @day`
    )
    .all({ month, day });

  if (!historyEvents.length) {
    return; // No events, nothing to do.
  }

  const historyEventIds = historyEvents.map((x) => x.id);
  const questionMarks = historyEventIds.map(() => '?').join(',');
  const historyEventRelatedLinks: HistoryEventRelatedLink[] = db
    .prepare(
      `SELECT * 
         FROM HistoryEventRelatedLink
        WHERE historyEventId IN (${questionMarks})`
    )
    .all(historyEventIds);

  // Delete existing records so they can be reinserted.
  const deleteLink = db.prepare(
    `DELETE FROM HistoryEventRelatedLink 
      WHERE historyEventId = @historyEventId
        AND relatedLinkId = @relatedLinkId`
  );
  const deleteHistoryEvent = db.prepare(
    `DELETE FROM HistoryEvent WHERE id = ?`
  );

  const deleteExistingRecords = db.transaction(
    (links: HistoryEventRelatedLink[], eventIds: number[]) => {
      for (const herl of links) {
        deleteLink.run(herl);
      }

      for (const heId of eventIds) {
        deleteHistoryEvent.run(heId);
      }
    }
  );

  deleteExistingRecords(historyEventRelatedLinks, historyEventIds);
}

export default function processEvents(
  month: number,
  day: number,
  data: WikiResponse
) {
  clearExistingRecords(month, day);

  const insertHistoryEvent = db.prepare(`
        INSERT INTO HistoryEvent(year,month,day,description) 
        VALUES(@year,@month,@day,@description)`);

  const insertRelatedLink = db.prepare(`
        INSERT INTO RelatedLink(title, url) 
        VALUES(@title,@url)`);

  const insertHistoryEventRelatedLink = db.prepare(`
        INSERT INTO HistoryEventRelatedLink(historyEventId, relatedLinkId) 
        VALUES(@historyEventId,@relatedLinkId)`);

  const insertEvents = db.transaction((events: WikiEvent[]) => {
    for (const ev of events) {
      const resultHE = insertHistoryEvent.run({
        year: ev.year,
        month,
        day,
        description: ev.description
      });

      const relatedLinkIds: number[] = [];
      for (const link of ev.wikipedia) {
        const relatedLink = db
          .prepare(`SELECT * FROM RelatedLink WHERE url = ?`)
          .get(link.wikipedia);

        if (relatedLink) {
          relatedLinkIds.push(relatedLink.id);
        } else {
          const resultRelatedLink = insertRelatedLink.run({
            title: link.title,
            url: link.wikipedia
          });

          relatedLinkIds.push(resultRelatedLink.lastInsertRowid as number);
        }
      }

      for (const relatedLinkId of relatedLinkIds) {
        insertHistoryEventRelatedLink.run({
          historyEventId: resultHE.lastInsertRowid,
          relatedLinkId
        });
      }
    }
  });

  insertEvents(
    data.events.filter((ev) => ev.description && ev.description.trim())
  );
}
