const express = require("express");
const app = express();
const connectDb = require("./config/db");

//connect to database
connectDb();

//define the routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));


app.get("/", (req, res) => res.send("API running"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening to ${port}`));
