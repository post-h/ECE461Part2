import { Metric } from "./Metric";

export class Licensing {//implements Metric{
    score : number = 0;

    calcMetric(_owner: string, _repo: string) : Promise<number>
    {
        //console.log("Calculating licensing score");
        return calc(_owner, _repo);
    }
}

// GNU Lesser General Public License version 2.1 is required. GPLv2 and GPLv3 are also compatible. Information is from GNU website --> URL pasted below 
// https://www.gnu.org/licenses/license-list.en.html

async function calc(_owner: string, _repo: string) : Promise<number>
{
    let gql_query = `
    
    {
        repository(owner: "${_owner}", name: "${_repo}") {
            licenseInfo {
                name
            }
        }
    }

    `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
    headers: {
        Authorization: `Token ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query: gql_query }),
    });

    const parsed_data = await response.json();
    let license : string = parsed_data['data']['repository']['licenseInfo']['name'];

    //console.log(license);
    if(license === "GNU Lesser General Public License v2.1" || license === "GNU Lesser General Public v2.0" || license === "GNU Lesser General Public v3.0" || license === "MIT License" || license === "Other")
    {
        return 1;
    }
    else
    {
        return 0;
    }
}
