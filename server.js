const express = require("express");
const app = express();
const connectDb = require("./config/db");
const path = require("path");

//connect to database
connectDb();

//init middleware
app.use(express.json({ extended: false }));

//define the routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

//app.get("/", (req, res) => res.send("API running"));
//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 3500;

app.listen(port, () => console.log(`Server listening to ${port}`));
