const { Octokit } = require('@octokit/rest');

async function getIssuesWithLabelsAndDateRange (octokit, owner, repo, labels, startDate, endDate) {
return await octokit.paginate(
        // There's a bug in the Octokit type declaration for `paginate`.
        // It won't let you use the endpoint method as documented: https://octokit.github.io/rest.js/v17#pagination.
        // Work around by using the route string instead.
        //octokit.issues.listForRepo,
        "GET /repos/:owner/:repo/issues",
        {
            owner,
            repo,
            labels: labels.join(','),  
        },(response) => response.data.filter(issue => issue.created_at >=startDate && issue.created_at <=endDate));
}

async function run () {
 
 OWNER = "priyakewlani18";
 REPO = "demoGithub";
 const octokit = new Octokit({
    auth:process.env.PROJECT_TOKEN,
    previews:['inertia-preview']
    });
 
 var startOfDay = new Date();                    
 startOfDay.setDate(startOfDay.getDate());
 startOfDay.setUTCHours(0,0,0,0);
 
 startOfDay = JSON.stringify(startOfDay).split('.')[0].split('"')[1]
 console.log("start of Day value is", startOfDay );

 var endOfDay = new Date(); 
 endOfDay.setUTCHours(23, 59, 59, 999);
 endOfDay = JSON.stringify(endOfDay).split('.')[0].split('"')[1]
        
 const issue = await getIssuesWithLabelsAndDateRange(octokit, OWNER, REPO, ["Incident"], startOfDay, endOfDay);

 console.log("issue length is", issue.length);
 return issue.length;
}



(async () => {
  try {
    await run();
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
