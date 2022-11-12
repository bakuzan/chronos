CREATE TABLE IF NOT EXISTS HistoryEvent(
    "id"    INTEGER      NOT NULL UNIQUE, 
    "year"  INTEGER      NOT NULL, 
    "month" INTEGER      NOT NULL, 
    "day"   INTEGER      NOT NULL, 
    "description"  VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT));