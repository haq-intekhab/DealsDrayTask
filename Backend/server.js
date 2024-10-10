const express = require("express");
const app = express();
const cors = require("cors");

// app.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(
  cors("*")
)

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const fileupload = require("express-fileupload");
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const { dbconnect } = require("./config/database");
dbconnect();

const test = require("./routes/test");
app.use("/api", test);
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
  });
