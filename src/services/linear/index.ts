import {LinearClient} from "@linear/sdk";
import {IssueCreateInput} from "@linear/sdk/dist/_generated_documents";
import {Feedback} from "../clear-flask/types";

import TurndownService from "turndown";

export class LinearService {

    private linearClient: LinearClient;
    private turndownService: TurndownService

    private linearApiKey: string = process.env.LINEAR_API_KEY!
    private linearTeamKey: string = process.env.LINEAR_TEAM_KEY!

    constructor() {
        this.linearClient = new LinearClient({
            apiKey: this.linearApiKey
        })

        this.turndownService = new TurndownService()
    }



    async getTeamByKey() {

        const teams = await this.linearClient.teams()


        const team = teams.nodes.find(t=> t.key === this.linearTeamKey)

        return team
    }


    private async createIssue(issue: IssueCreateInput){

        const createdIssue = await this.linearClient.createIssue(issue)

        return createdIssue
    }

    submitIssuesToLinear(teamID:string ,feedbacks: Feedback[]){


        feedbacks.forEach(async (feedback) => {
            await this.createIssue({
                teamId: teamID,
                title: feedback.title,
                description: this.turndownService.turndown(feedback.description),

            })
        })

    }
}