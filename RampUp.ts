/************************************************************************************************************************************************************************
 * Name:     RampUp
 * Authors:  Kevin Hasier & Fred Kepler
 * Language: TypeScript
 * 
 * Description: 
 *      This script will clone an open-source GitHub module repository based on URL given. It will then call cloc to calculate comments and 
 *      source lines of the files within the module given. It will then remove clone directory. These are done using a child process. 
 *      Based on these numbers, it will calculate a score in range [0,1] to describe ramp up time (0 being the worst, 1 being the best). Ideally, a lower ramp up time 
 *      means new users can learn a module quickly and easily. Therefore, measuring LOC and comparing this to amount of comments would give us an idea of how complex the 
 *      code is (higher ratio of comments = easier to understand = lower ramp up time). We say that one comment for every 5 lines of source code is an average ratio 
 *      (score of 0.5).
 ************************************************************************************************************************************************************************/
import * as fs from 'fs';
import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';
import { Metric } from "./Metric";

export class RampUp implements Metric{

    constructor(public url: string) {
    }

    calcMetric() : number
    {
        // Call conductRampUp function and send in current URL
        const ratio = conductRampUp(this.url);

        // We say a ratio of 1:5 is worth a score of 0.5. To account for this, we multiply by 2.5 because 1:5 = 1/5 = 0.2 and 0.2 * 2.5 = 0.5.
        var score:number = ratio * 2.5;
        if(score > 1) { // cap score at 1
            score = 1;
        }
        return score;
    }
}

function conductRampUp(url : string): number {

    // For some reason, git clone logs the message "Cloning into './clone'..." as stderr
    // so keep that in mind if changes happen here.
    // Clone url repo
    spawnSync('git', ['clone', url, './clone']);

    // Run cloc on directory and create cloc_output.sql SQL database file with stdout of cloc
    const cloc_out = spawnSync('perl', ['cloc-1.96.pl', '--sql', '1', './clone']);

    writeFileSync('./clone/cloc_output.sql', cloc_out.stdout);

    // Pipes SQL stdout file to sqlite3 to create code.db file
    spawnSync('sqlite3', ['./clone/code.db'], {
        input: fs.readFileSync('./clone/cloc_output.sql', 'utf-8'),
    }); 

    // Pulls sum of code and comments from code.db and separately pulls lines of code from Markdown (README.md) file as this is logged as code
    // but should be logged as comments since it used to inform 
    // stdout_sqlite.stdout.toString() returns string in form of sum(nCode)|sum(nComment)
    const stdout_sqlite = spawnSync('sqlite3', ['./clone/code.db', 'select sum(nCode), sum(nComment) from t']);
    //const stdout_markdown = spawnSync('sqlite3', ['./clone/code.db', 'select sum(nCode) from t where language="Markdown"']);

    // Splits string using | as delimiter
    var split_str : string[] = stdout_sqlite.stdout.toString().split("|", 2);

    // +(string) converts string into number format 
    // i.e. turns string "5" into number 5
    var CodeSum : number = +(split_str[0]);
    var CommentSum : number = +(split_str[1]);
    //var markdownSum : number = +(stdout_markdown.stdout.toString());

    // Subtract markdown sum from code and add to comments to account for REAME.md files
    //CodeSum -= markdownSum;
    //CommentSum += markdownSum;

    // Create ratio between comments and code
    var ratio : number = CommentSum / CodeSum;

    // Remove cloned directory
    spawnSync('rm', ['-rf', './clone']);

    return ratio;
}