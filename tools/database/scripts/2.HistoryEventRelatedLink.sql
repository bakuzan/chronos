CREATE TABLE IF NOT EXISTS HistoryEventRelatedLink(
    "historyEventId"    INTEGER NOT NULL,  
    "relatedLinkId"     INTEGER NOT NULL, 
    FOREIGN KEY("historyEventId")   REFERENCES "HistoryEvent"("Id"),
    FOREIGN KEY("relatedLinkId")    REFERENCES "RelatedLink"("Id"));