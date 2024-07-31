const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutesApi = require("./Routes/user");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1,UserAuth")
  .then(() => console.log("db connected succesfully"))
  .catch((err) => console.error(err));


app.use("/api/v1/user", userRoutesApi);

app.listen(10000, () => {
  console.log(`Server is running up on 10000`);
});
