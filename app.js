// Import required modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sampleDb = new Sequelize(
    process.env.SQL_DATABASE,
    process.env.SQL_USERNAME,
    process.env.SQL_PASSWORD,
    {
        dialect: "mssql",
        host: process.env.SQL_HOST,
        port: 1433, // Default port
        logging: false, // disable logging; default: console.log
        dialectOptions: {
            requestTimeout: 30000, // timeout = 30 seconds
        },
    },
);

const User = sampleDb.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    age: {
        type: Sequelize.INTEGER,
    },
    email: {
        type: Sequelize.STRING,
    },
});

const app = express();

// enable cors for client
const corsOption = {
    origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));

// Middleware
app.use(bodyParser.json());
app.use(express.json());


// post new user 
app.post("/newUser", async function (req, res) {
    sampleDb.sync({ force: true }).then(async function () {
        let { username, password } = req.body;
        // Create demo: Create a User instance and save it to the database
        let newUser = await User.create({ username, password });
        // insert into users (username, password) values ('ori', '123')
        // console.log("newUser:", newUser)
        res.send(newUser.dataValues);
    });
});

// get all users
app.get("/users", async (req, res) => {
    let users = await User.findAll();
    res.send(users);
});
// get specific user by params
app.get("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    let user = await User.findOne({ where: { id } });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
});

// update an existing user
app.put("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await User.findOne({ where: { id }})
    if (!user) return res.status(404).send("User not found");
    const { age, email } = req.body;
    let updatedUser = await User.update({ age, email }, { where : { id } })
    res.send(updatedUser);
});

const port = 8080;
// Start server
app.listen(port, () => {
    console.log("Server started on port " + port);
});
