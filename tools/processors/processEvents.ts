import db from '../database';

import { ChronosOptions } from '../constants/ChronosOptions';
import { WikiEvent, WikiResponse } from '../types/WikiResponse';

export default function processEvents(
  opts: ChronosOptions,
  data: WikiResponse
) {
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
        year: Number(ev.year),
        month: opts.month,
        day: opts.day,
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

  insertEvents(data.events);
}
