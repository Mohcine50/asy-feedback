import 'dotenv/config'
import cron from 'node-cron';
import express, { Express, Request, Response } from "express";

import cors from "cors";
import { ClearFlaskService } from "./services/clear-flask";
import { LinearService } from "./services/linear";
import {RedisService} from "./services/redis";


const app: Express = express();
const port = process.env.PORT || 3000;
const schedule = process.env.CRON_SCHEDULE || '* * * * *';

const REDIS_TIMESTAMP_KEY = "lastAddedFeedbackTimeStamp"
const REDIS_LINEAR_Team_KEY = "linearTeamKey"
const REDIS_LINEAR_Team_ID = "linearTeamID"

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const clearFlaskService = new ClearFlaskService()
const linear = new LinearService()
const redis = new  RedisService()




cron.schedule(schedule, async ()=>{


    const feedbacks = await clearFlaskService.fetchFeedbacks()

    if (!feedbacks || !feedbacks.length) return

    const last = await redis.retrieveRedisData(REDIS_TIMESTAMP_KEY);

    const teamKey = await redis.retrieveRedisData(REDIS_TIMESTAMP_KEY);

    if (!teamKey || teamKey !== process.env.LINEAR_TEAM_KEY!){
        const team = await linear.getTeamByKey();
        await redis.addRedisData(REDIS_LINEAR_Team_KEY, process.env.LINEAR_TEAM_KEY!);
        await redis.addRedisData(REDIS_LINEAR_Team_ID, team?.id!);
    }

    const teamID = await redis.retrieveRedisData(REDIS_LINEAR_Team_ID);

    let filteredFeedback = feedbacks

    if (last) {
        filteredFeedback = feedbacks?.filter(feedback => new Date(feedback.created).getTime() > new Date(last).getTime()) ?? []
    }

    if (!filteredFeedback || !filteredFeedback.length) return

    linear.submitIssuesToLinear(teamID!, filteredFeedback)
    await redis.addRedisData(REDIS_TIMESTAMP_KEY, filteredFeedback[0].created);

})


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});