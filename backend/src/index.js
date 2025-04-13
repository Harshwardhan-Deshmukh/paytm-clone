import cors from "cors";
import express from "express";
import morgan from "morgan";
import { PORT } from "./config/configs.js";
import userRouter from "./routes/userRoutes.js";
import responseHandler from "./utils/responseHandler.js";
import walletRouter from "./routes/walletRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";

const app = express();
const port = PORT;

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({}));

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/transfer", transactionRouter);

// default response
app.use((req, res) => {
  return responseHandler(
    res,
    404,
    "ERROR",
    null,
    `Endpoint ${req.originalUrl} Not Found`,
  );
});

// global catch
app.use((err, _req, res, _next) => {
  return responseHandler(
    res,
    err.statusCode || 500,
    "ERROR",
    null,
    err.message,
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
