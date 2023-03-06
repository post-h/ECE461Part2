import { Metric } from "./Metric";
import { environment } from './environment/environment';

export class Licensing {//implements Metric{
    score : number = 0;

    constructor(public owner: string, public repo: string) {
    }

    calcMetric() : Promise<number>
    {
        // console.log("Calculating licensing score");
        return calc(this.owner, this.repo);
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
        Authorization: `Token ${environment.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query: gql_query }),
    });

    const parsed_data = await response.json();
    // let license : string = parsed_data['data']['repository']['licenseInfo']['name'];
    let license : string = parsed_data['data']['repository']['licenseInfo']?.name;


    //console.log(license);
    if(license === "GNU Lesser General Public License v2.1" || license === "GNU Lesser General Public v2.0" || license === "GNU Lesser General Public v3.0" || license === "MIT License")
    {
        return 1;
    }
    else
    {
        return 0;
    }
}