import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const clearFlaskApiUrl:string = process.env.CLEAR_FLASK_API_URL!
const clearFlaskApiKey:string = process.env.CLEAR_FLASK_API_KEY!

app.use(cors());
app.use(express.json())

app.use((req:Request, res: Response, next)=>{
    console.log("USED METHOD: "+ req.method);
    next()
})


app.get("/", (req: Request, res: Response) => {
    res.send("Welcome");
});

app.post('/webhook', (req: Request, res: Response) => {
    const event = req.body;

    console.log(req.body)
    console.log('Received webhook event:', event);

    res.status(200).send('Webhook received');
});

app.post('/', (req: Request, res: Response) => {
    const event = req.body;

    console.log(req.body)
    console.log('Received webhook event:', event);

    res.status(200).send('Webhook received');
});





app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});