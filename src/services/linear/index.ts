import {LinearClient} from "@linear/sdk";
import {IssueCreateInput} from "@linear/sdk/dist/_generated_documents";
import {Feedback} from "../clear-flask/types";

import TurndownService from "turndown";
import he from "he";

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

        const teams = await this.linearClient.teams({filter:{
            key:{
                eq:this.linearTeamKey
            }
            }})

        return teams.nodes[0]
    }

    async getLabelByName() {
        const labels = await this.linearClient.issueLabels({
            filter:{
                name: {eq:"ClearFlask"}
            }
        })

        return labels.nodes[0]

    }

    async createLabel(teamId:string){
        const createdLable = await  this.linearClient.createIssueLabel({
            name:"ClearFlask",
            teamId: teamId
        })

        return createdLable.issueLabel;
    }


    private async createIssue(issue: IssueCreateInput){

        const createdIssue = await this.linearClient.createIssue(issue)

        return createdIssue
    }

    submitIssuesToLinear(teamID: string , labelId: string,feedbacks: Feedback[]){
        feedbacks.forEach(async (feedback) => {

            const createdIssue = await this.createIssue({
                teamId: teamID,
                title: feedback.title,
                description: this.turndownService.turndown(he.decode(feedback.description)),
                labelIds:[labelId]
            })

        })

    }
}