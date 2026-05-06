import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Database (Create table if it doesn't exist)
const initializeDb = async () => {
    try {
        const client = await pool.connect();
        const dbUrl = process.env.DATABASE_URL || 'UNDEFINED';
        const redactedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
        console.log(`✅ Successfully connected to the PostgreSQL database: ${redactedUrl}`);
        
        // Create table query
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                college_name VARCHAR(255) NOT NULL,
                year VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        await client.query(createTableQuery);
        console.log('✅ Users table check complete.');
        
        client.release();
    } catch (err) {
        const dbUrl = process.env.DATABASE_URL || 'UNDEFINED';
        const redactedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
        console.error('❌ Database error details:', err.message);
        console.log(`⚠️  Debug Info: Connecting to ${redactedUrl}`);
        console.log('⚠️  Ensure PostgreSQL is running on the specified port.');
    }
};

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, collegeName, year, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Insert new user into database
    // Note: In a production environment, you MUST hash the password using bcrypt before saving it!
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, college_name, year, password) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, first_name, last_name, email`,
      [firstName, lastName, email, collegeName, year, password]
    );

    res.status(201).json({ 
      message: 'Account created successfully', 
      user: newUser.rows[0] 
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Server error while creating account' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    // Case-insensitive and trimmed comparison
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    console.log(`🔍 LOGIN ATTEMPT: [${cleanEmail}]`);

    const user = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1 AND password = $2', [cleanEmail, cleanPassword]);

    if (user.rows.length === 0) {
      console.log(`❌ LOGIN FAILED: No match for [${cleanEmail}]`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ LOGIN SUCCESS: [${cleanEmail}]`);

    // Force refresh comment
    res.json({ 
      message: 'Login successful', 
      user: {
        id: user.rows[0].id,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        email: user.rows[0].email
      } 
    });

  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error); // Log the full error object
    res.status(500).json({ error: 'Internal Server Error during login', details: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initializeDb();
});
