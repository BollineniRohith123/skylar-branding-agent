-- Migration: 0001_create_email_verification.sql
-- Creates the email_verification table for OTP-based email verification
CREATE TABLE IF NOT EXISTS email_verification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    otp VARCHAR(10) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempt_count INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    regeneration_count INT DEFAULT 0,
    max_regenerations INT DEFAULT 3,
    status VARCHAR(20) DEFAULT 'pending',
    last_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_email (email),
    KEY idx_status (status)
);
