import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})

export default db
