
import { Octokit } from "octokit";


const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,  // change to your token for now,  I will figure out how to get to use the environment variable soon
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
    let license : string = response['data']['license']?.name;
    //console.log("Inside function: " + typeof(license));
    //console.log("Inside function: " + license);
    return license;
}

export async function getOpenIssues(_owner:string, _repo: string) : Promise<number>
{
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: _owner,
        repo: _repo,
    });

    //console.log(response['data']['open_issues']);
    let open_issues : number = response['data']['open_issues'];
    
    return open_issues;
}

export async function getLastUpdate(_owner:string, _repo: string) : Promise<string>
{
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: _owner,
        repo: _repo,
    });

    //console.log(typeof(response['data']['updated_at']));
    let date : string = response['data']['updated_at'];
    
    return date.substring(0,4) + date.substring(5,7) + date.substring(8,10); // string formatted: "YYYYMMDD"
}

export async function getContributors(_owner:string, _repo: string) : Promise<number>
{
    const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
        owner: _owner,
        repo: _repo,
        per_page: 100,
    });

    //console.log(response['data']);
    //let contributors : string = response['data'][0]?.login;
    //console.log("Number of contributors %d", (response['data']).length);
    //console.log(contributors);

    let num_contributors : number = response['data'].length;
    let total_contributions : number = 0;

    for( let i = 0; i < num_contributors; i++ )
    {
        total_contributions += response['data'][i]?.contributions;
    }
    
    // a good contributor is defined as someone who has accounted for at least (1 / num_contributors)% of total contributions 
    // we decided on this, 
    let num_good_contributors : number = 0; 
    let target_contributions : number = total_contributions / num_contributors;

    for( let i = 0; i < num_contributors; i++ )
    {
        let user_contributions : number = response['data'][i]?.contributions;
        if( user_contributions >= target_contributions )  
        {
            num_good_contributors += 1;
        }
    }

    let final_score: number = 0;

    // worst case scenario is there is only 1 contributor that is responsible bus factor
    // this is the highest possible risk, so it gets a score of zero
    if( num_good_contributors === 1 ) 
    {
        final_score = 0;
    }
    else // otherwise we return a ratio of the good contributors to total
    {
        // a perfect score is earned if everyone makes their "fair share" of meaningful contributions. If one person got "hit by a bus", the project can still continue
        final_score = (num_good_contributors) / num_contributors; // this ratio will be in the range [0,1]
    }
    
    // caps score at 0.5 (by dividing by 2) if there are less than 10 total contributors to begin with
    if( num_contributors <= 5 )
    {
        return final_score / 2;
    }
    // used to handle when there are more than 100 contributors, because requests for multiple pages may throw errors when there aren't multiple pages available
    else if( num_contributors == 100 ) 
    {
        if( final_score + 0.5 > 1 )
        {
            return 1;
        }
        return final_score + 0.5;
    }
    else if( num_contributors >= 50 )
    {
        if( final_score + 0.25 > 1)
        {
            return 1;
        }
        return final_score + 0.25;
    }
    else
    {
        return final_score;
    }
}
