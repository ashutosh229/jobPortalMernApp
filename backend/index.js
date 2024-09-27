import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

//dotenv configurations
import dotenv from "dotenv";
dotenv.config({});

//app
const app = express();

//middleware
app.use(express.json()); //parsing the data into the json format when passed during the API call
app.use(express.urlencoded({ extended: true })); //for encoding the url when the end point is passed
app.use(cookieParser()); //something related to the token

//cors configurations
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

//port
const port = process.env.PORT || 3000;

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("api/v1/application", applicationRoute);

//listener
app.listen(port, () => {
  connectDB();
  console.log(`Server is running at the port ${port}`);
});
