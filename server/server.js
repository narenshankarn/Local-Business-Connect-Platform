import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" }); 
console.log("Loaded PORT:", process.env.PORT); 

const db = new pg.Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PGPORT
});
db.connect();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM restaurants");
        res.send(result.rows);
    }
    catch(error) {
        console.log(error);
    }
});

app.get("/getRestaurants/:id", async (req, res) => {
    const id = req.params.id;
    console.log(typeof id);
    try{
        const result = await db.query("SELECT * FROM restaurants WHERE id = $1", [id]);
        res.send(result.rows);
    }
    catch(error) {
        console.log(error);
    }
});

app.post("/addRestaurant", async (req, res) => {
    const name = req.body.name;
    const location = req.body.location;
    const price_range = req.body.price_range;
    try{
        console.log(name, location, price_range);
        const result = await db.query("INSERT INTO restaurants(name, location, price_range) VALUES($1, $2, $3) returning *", [name, location, price_range]);
        res.send(result.rows);
    }
    catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
