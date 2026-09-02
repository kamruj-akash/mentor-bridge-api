import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { AuthRoute } from "./module/auth/auth.route";

const app: Application = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", AuthRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello MentorBridge V1.0!" });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
