import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import apiRouter from "./src/routes/apiRouter.js";
import pageRouter from "./src/routes/pageRouter.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import customerWithdrawalsModel from "./src/models/customerWithdrawalsModel.js";

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

// Generates Withdrawals On Monthly Bases
// cron.schedule("0 0 1 * *", async () =>
// {
//     try
//     {
//         // await customerWithdrawalsModel.insertLastMonthsWithdrawals();
//         // await customerWithdrawalsModel.insertLastMonthsWithdrawalsForAgencies();

//         await customerWithdrawalsModel.insertLastMonthsWithdrawals();
//         console.log("[WITHDRAWALS] Monthly Withdrawals Generated Successfully");
//     } catch (error)
//     {
//         console.log("[WITHDRAWALS] Error Generating Monthly Withdrawals", error);
//     }
// });

// Generates Withdrawals On Minute Bases
// cron.schedule("*/1 * * * *", async () =>
// {
//     try
//     {
//         // await customerWithdrawalsModel.insertLastMonthsWithdrawals();
//         // console.log("[WITHDRAWALS] Minutely Customer Withdrawals Generated Successfully");
//         // await customerWithdrawalsModel.insertLastMonthsWithdrawalsForAgencies();
//         // console.log("[WITHDRAWALS] Minutely Agency Withdrawals Generated Successfully");

//         await customerWithdrawalsModel.insertLastMonthsWithdrawals();
//         console.log("[WITHDRAWALS] Minutely Customer Withdrawals Generated Successfully");
//     } catch (error)
//     {
//         console.log("[WITHDRAWALS] Error Generating Minutely Withdrawals", error);
//     }
// });

app.listen(port, "0.0.0.0", () =>
{
    console.log(`Server is walking at http://localhost:${port}`);
});
