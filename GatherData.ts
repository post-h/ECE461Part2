
import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: '',  // change to your token for now,  I will figure out how to get to use the environment variable soon
    userAgent: 'testing',
    timeZone: "Eastern",
    baseUrl: 'https://api.github.com',
});


export async function getLicense(_owner:string, _repo: string) : Promise<string>
{
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: _owner,
        repo: _repo,
    });
    let license : string = response['data']['license']!.name;
    
    return license;
}

/************************************************************************************************************************************************************************
* Name:     calcMaintainers
* Authors:  Kevin Hasier & Fred Kepler & Jack Stavrakos
* Language: TypeScript
* 
* Description: 
*      This function uses the octokit client and the REST API to collect information on maintainers and their responsiveness. It first collects information on the 
*      contributors. It calculates the total number of contributions and the total number of contributors. We then define a "good contributor" as someone who has 
*      made equal or more contributions according to the ratio of total contributions to the number of contributors. Then, we assigna preliminary score based on the 
*      the number of "good contributors" AKA maintainers. The more maintainers, the more likely they will be responsive. We then collect a boolen on whether discussions
*      exist within the repo. We add a score of 0.2 if there are discussions, as discussions lead us to believe that the maintainers are active in the repo and wihtin
*      the community. Lastly, we collect information on issues. We grab the last 10 issues, and calculate the amount of time it took for the issue to close. If the 
*     issue is not closed, we use the current date as the "close" date. We then add these times up and divide by 10 to get an average reponse time. We then adjust the
*      score appropriately. 
************************************************************************************************************************************************************************/
export async function calcMaintainers(_owner:string, _repo:string) : Promise<number> {
    let score : number;

    // Request info on contributors
    const contributors_response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
        owner: _owner,
        repo: _repo,
        per_page: 100,
    });

    // Grab number of contributors and initialize total_contributions
    let num_contributors : number = contributors_response['data'].length;
    let total_contributions : number = 0;

    // Loop through all contributions and calculate total number of contributions
    for( let i = 0; i < num_contributors; i++ )
    {
        total_contributions += contributors_response['data'][i]?.contributions;
    }

    // A good contributor is defined as someone who has accounted for at least (1 / num_contributors)% of total contributions 
    let num_good_contributors : number = 0; 
    let target_contributions : number = total_contributions / num_contributors;

    // Loop through contributors and comapre their number of contributions to the ratio defined above
    for( let i = 0; i < num_contributors; i++ )
    {
        let user_contributions : number = contributors_response['data'][i]?.contributions;
        if( user_contributions >= target_contributions )  
        {
            num_good_contributors += 1;
        }
    }

    // Assign preliminary score based on number of maintainers
    if(num_good_contributors > 0 && num_good_contributors < 5) {
        score = 0;
    }
    else if(num_good_contributors > 4 && num_good_contributors < 10) {
        score = 0.2;
    }
    else if(num_good_contributors > 9 && num_good_contributors < 15) {
        score = 0.4;
    }
    else if(num_good_contributors > 14 && num_good_contributors < 20) {
        score = 0.6;
    }
    else {
        score = 0.8;
    }

    // Request info on repo
    const discussion_response = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: _owner,
        repo: _repo,
    });

    // Get boolan on discussions and assign score increment if true
    let discussions : boolean = discussion_response['data']['has_discussions'];

    if(discussions) {
        score += 0.2;
    }

    // Request info on issues 
    const issues_response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: _owner,
        repo: _repo,
    });

    // Initialize variables 
    let closed_at_date;
    let last_10_issues_time = 0;
    const current_date = new Date();

    // Loop through most recent 10 issues and calculate how long it took to be resolved
    for( let i = 0; i < 10; i++ )
    {
        if(issues_response['data'][i] == undefined) {
        break;
        }

        if(issues_response['data'][i].closed_at == null) {
        closed_at_date = current_date;
        }
        else {
        closed_at_date = new Date(issues_response['data'][i].closed_at);
        }

        let created_at_date = new Date(issues_response['data'][i].created_at);

        last_10_issues_time += closed_at_date.getTime() - created_at_date.getTime();
    }

    // Get average time to resolution and convert to days (output is in milliseconds)
    let avg_resp_time = last_10_issues_time / 10;
    avg_resp_time /= 3600000 * 24;

    // Adjust score accordingly 
    if(avg_resp_time > 60 || avg_resp_time == 0) {
        score = 0;
    }
    else if(avg_resp_time > 40 && avg_resp_time <= 60) {
        score -= 0.4;
    }
    else if(avg_resp_time > 30 && avg_resp_time <= 40) {
        score -= 0.2;
    }
    else if(avg_resp_time > 20 && avg_resp_time <= 30) {
        score = score;
    }
    else if(avg_resp_time > 10 && avg_resp_time <= 20) {
        score += 0.2;
    }
    else {
        score += 0.4;
    }

    // Ceiling and floor score 
    if(score > 1) {
        score = 1;
    }
    else if( score < 0) {
        score = 0;
    }

    return score;
}