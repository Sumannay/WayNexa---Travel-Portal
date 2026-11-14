CREATE DATABASE IF NOT EXISTS waynexa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE waynexa;

CREATE TABLE IF NOT EXISTS waynexa_users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS waynexa_sessions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP(3) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  last_used_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX waynexa_sessions_user_expiry (user_id, expires_at),
  CONSTRAINT waynexa_sessions_user_fk
    FOREIGN KEY (user_id) REFERENCES waynexa_users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS waynexa_user_data (
  user_id CHAR(36) NOT NULL PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT waynexa_user_data_user_fk
    FOREIGN KEY (user_id) REFERENCES waynexa_users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS waynexa_activity_events (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  event_type VARCHAR(48) NOT NULL,
  details JSON NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX waynexa_activity_user_time (user_id, created_at),
  INDEX waynexa_activity_time (created_at),
  CONSTRAINT waynexa_activity_user_fk
    FOREIGN KEY (user_id) REFERENCES waynexa_users (id) ON DELETE CASCADE
);
