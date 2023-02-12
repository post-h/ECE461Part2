
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