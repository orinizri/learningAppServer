// Import required modules
import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

// create express instance
const app = express();

// enable cors for client
const corsOption = {
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));

// Middleware
app.use(bodyParser.json());

// Datastore
let users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
];

// Routes
// GET all users
app.get("/users", (req, res) => {
    res.send(users);
});
app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

// GET a single user by ID
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.send(user);
});

// POST a new user
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const id = users.length + 1;
    const newUser = { id, name, email };
    users.push(newUser);
    res.send(newUser);
});

// PUT an existing user
app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const { name, email } = req.body;
    user.name = name;
    user.email = email;
    res.send(user);
});

// DELETE an existing user
app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).send("User not found");
    }
    users.splice(index, 1);
    res.send("User deleted");
});
const port = 8080;
// Start server
app.listen(port, () => {
    console.log("Server started on port " + port);
});
