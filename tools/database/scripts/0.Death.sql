CREATE TABLE IF NOT EXISTS Death(
    "id"            INTEGER      NOT NULL UNIQUE, 
    "year"          VARCHAR(10)  NOT NULL, 
    "month"         INTEGER      NOT NULL, 
    "day"           INTEGER      NOT NULL, 
    "description"   VARCHAR      NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT));