CREATE TABLE IF NOT EXISTS RelatedLink(
    "id"                INTEGER      NOT NULL UNIQUE, 
    "title"             VARCHAR(255) NOT NULL,
    "url"               VARCHAR      NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT));