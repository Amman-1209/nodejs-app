require('dotenv').config();

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_user}:${process.env.DB_password}@${process.env.DB_host}:${process.env.DB_port}/${process.env.DB_database}`;

const pool= new Pool({
    connectionString: isProduction? process.env.DATABASE_URL : connectionString
});

module.exports = {pool};
