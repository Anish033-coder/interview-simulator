-- Initial schema for a NEW local database; not an upgrade migration.
BEGIN;
CREATE TABLE users (
  id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE problems (
  id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, description TEXT NOT NULL,
  difficulty VARCHAR(10) NOT NULL, topic VARCHAR(50), examples TEXT NOT NULL,
  test_cases TEXT NOT NULL
);
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
  problem_id INTEGER NOT NULL REFERENCES problems(id), language VARCHAR(20) NOT NULL,
  final_code TEXT, time_taken INTEGER, test_cases_passed INTEGER DEFAULT 0,
  test_cases_total INTEGER DEFAULT 0, status VARCHAR(20) DEFAULT 'ongoing',
  started_at TIMESTAMP DEFAULT NOW(), ended_at TIMESTAMP
);
CREATE TABLE ai_messages (
  id SERIAL PRIMARY KEY, session_id INTEGER NOT NULL REFERENCES sessions(id),
  message TEXT NOT NULL, code_snapshot TEXT, created_at TIMESTAMP DEFAULT NOW()
);
COMMIT;
