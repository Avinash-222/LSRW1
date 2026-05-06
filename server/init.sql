-- Paste and run this SQL query into pgAdmin or your terminal (psql) 
-- to create the users table before starting your server!

CREATE DATABASE lsrw;

-- Run this inside the lsrw database to create the table structure
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Remember to hash this in a real production app
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
