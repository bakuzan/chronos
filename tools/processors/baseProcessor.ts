import { Statement } from 'better-sqlite3';

import db from '../database';

import { WikiEvent } from '../types/WikiResponse';

export default function baseProcessor(
  month: number,
  day: number,
  events: WikiEvent[],
  insertEventItem: Statement<any[]>,
  insertEventItemRelatedLink: Statement<any[]>
) {
  const insertRelatedLink = db.prepare(`
    INSERT INTO RelatedLink(title, url) 
    VALUES(@title,@url)`);

  const insertEvents = db.transaction((events: WikiEvent[]) => {
    for (const ev of events) {
      const resultHE = insertEventItem.run({
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
        insertEventItemRelatedLink.run({
          eventId: resultHE.lastInsertRowid,
          relatedLinkId
        });
      }
    }
  });

  insertEvents(events.filter((ev) => ev.description && ev.description.trim()));
}
