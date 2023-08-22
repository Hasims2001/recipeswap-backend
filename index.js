const express = require("express");
const { connectToDB } = require("./db");
const { userRouter } = require("./routes/userRoutes");
const { recipeRouter } = require("./routes/recipeRouters");
const { auth } = require('./middleware/auth.middleware');

const path = require("path");
const app = express();
app.use(express.json());
app.use('/users', userRouter);

app.use('/recipe', recipeRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));

})


app.listen(8080, async () => {
    try {
        await connectToDB;
        console.log("server is running...");
    } catch (err) {
        console.error(err);
    }
})


