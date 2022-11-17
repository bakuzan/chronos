CREATE TABLE IF NOT EXISTS DeathRelatedLink(
    "deathId"    INTEGER NOT NULL,  
    "relatedLinkId"     INTEGER NOT NULL, 
    FOREIGN KEY("deathId")   REFERENCES "Death"("Id"),
    FOREIGN KEY("relatedLinkId")    REFERENCES "RelatedLink"("Id"));