import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello MentorBridge V1.0!" });
});

export default app;
