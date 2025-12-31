import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import apiRouter from "./src/routes/apiRouter.js";
import pageRouter from "./src/routes/pageRouter.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);
app.use(pageRouter);

app.listen(port, "0.0.0.0", () =>
{
    console.log(`Server is walking at http://localhost:${port}`);
});
