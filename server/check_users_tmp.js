import pool from './db.js';

const checkUsers = async () => {
    try {
        const res = await pool.query('SELECT * FROM users;');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
