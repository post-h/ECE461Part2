import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,  // change to your token for now,  I will figure out how to get to use the environment variable soon
    userAgent: 'testing',
    timeZone: "Eastern",
    baseUrl: 'https://api.github.com',
});

export async function getVersionPinning(_owner:string, _repo:string): Promise<boolean> {
    
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/package.json', {
        owner: _owner,
        repo: _repo,
    });

    const packageJson = Buffer.from(response.data.content, "base64").toString();
    const dependencies = JSON.parse(packageJson).devDependencies || {};
    const packageVersion = dependencies[_repo];

    console.log(packageVersion !== undefined);
    return packageVersion !== undefined;
}
export async function getAdherence(_owner:string, _repo:string): Promise<boolean> {
    
    const discussion_response = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: _owner,
        repo: _repo,
    });
    
    let discussions : boolean = discussion_response['data']['has_discussions'];

    const issues_response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: _owner,
        repo: _repo,
    });

    let closed_at_date;
    let last_10_issues_time = 0;
    const current_date = new Date();
    let responsiveness : boolean;
    let adherence : boolean;

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
        closed_at_date = new Date(issues_response['data'][i].closed_at!);
        }

        let created_at_date = new Date(issues_response['data'][i].created_at);

        last_10_issues_time += closed_at_date.getTime() - created_at_date.getTime();
    }

    // Get average time to resolution and convert to days (output is in milliseconds)
    let avg_resp_time = last_10_issues_time / 10;
    avg_resp_time /= 3600000 * 24;

    if(avg_resp_time <= 30) {
        responsiveness = true;
    }
    else {
        responsiveness = false;
    }

    if (discussions && responsiveness) {
        adherence = true;
    }
    else {
        adherence = false;
    }
    console.log(adherence);
    return adherence;
}