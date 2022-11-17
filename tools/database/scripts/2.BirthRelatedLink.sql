CREATE TABLE IF NOT EXISTS BirthRelatedLink(
    "birthId"    INTEGER NOT NULL,  
    "relatedLinkId"     INTEGER NOT NULL, 
    FOREIGN KEY("birthId")   REFERENCES "Birth"("Id"),
    FOREIGN KEY("relatedLinkId")    REFERENCES "RelatedLink"("Id"));