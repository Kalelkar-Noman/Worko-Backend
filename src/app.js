import express from "express";
import cors from "cors";

const app = express();

//use after creating Frontend
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

// remove this part after frontend
app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/worko/users", userRouter);

// http://localhost:8000api/v1/worko/users/

export { app };
