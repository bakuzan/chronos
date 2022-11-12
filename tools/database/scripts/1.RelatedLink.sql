CREATE TABLE IF NOT EXISTS RelatedLink(
    "id"                INTEGER      NOT NULL UNIQUE, 
    "title"             VARCHAR(255) NOT NULL UNIQUE,
    "url"               VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT));