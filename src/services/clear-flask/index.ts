import axios from "axios";
import {Feedback} from "./types";


export class ClearFlaskService {

    private API_KEY: string  = process.env.CLEAR_FLASK_API_KEY!;
    private API_URL: string  = process.env.CLEAR_FLASK_API_URL!;
    private PROJECT_ID: string  = process.env.PROJECT_ID!;




    async fetchFeedbacks():Promise<Feedback[]| null>{
        const data = {
            sortBy: 'New'
        };

        const url = `${this.API_URL}/v1/project/${this.PROJECT_ID}/ideasearch`;

        try {
            const res = await axios.post(url, data, {
                headers: {
                    'accept': 'application/json',
                    'x-cf-token': this.API_KEY,
                    'Content-Type': 'application/json'
                }
            })

            return res.data.results
        }catch (e) {
            console.error(e);
            return null
        }

    }



}