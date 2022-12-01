import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import db from './config/dataBase.js'


const app = express()
dotenv.config()

//for auth problem use this command
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'V3n3rat3@3062'

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json("Hello World")
})

app.get("/vendors", (req,res) => {
    const q = "SELECT * FROM vendors"
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/signup",async (req,res) =>  {
    const q = "INSERT INTO vendors (fname,lname, email, password) VALUES (?)";
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    
    const values = [
        req.body.fname, 
        req.body.lname, 
        req.body.email, 
        hashedPassword, ];
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("Vendor has been created successfully")
    })
})

app.post("/login", async (req,res) => {
    try {
        const q = "SELECT * FROM vendors WHERE email = ? ";
        const salt = await bcrypt.genSalt(10)
        const values = [req.body.email];
        db.query(q, values,async (err, data) => {
            console.log(data[0].password)
            if(err) return res.json(err)
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            await bcrypt.compare(data[0].password, hashedPassword);
            return res.json("Logged in successfully")
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})


