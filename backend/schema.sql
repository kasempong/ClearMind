CREATE TABLE IF NOT EXISTS entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
  ticker     TEXT    NOT NULL,
  direction  TEXT    NOT NULL DEFAULT 'long',
  emotion    TEXT    NOT NULL DEFAULT 'calm',
  outcome    TEXT    NOT NULL DEFAULT 'open',
  confidence INTEGER NOT NULL DEFAULT 3,
  setup      TEXT    NOT NULL DEFAULT '',
  notes      TEXT    NOT NULL DEFAULT '',
  biases     TEXT    NOT NULL DEFAULT ''
);
