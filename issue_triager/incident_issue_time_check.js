const { Octokit } = require('@octokit/rest');
const date = '2022-11-01T00:00:00Z'
StartRegexFormat = [/(?<=When did the incident start \(UTC\)\r\n\r\n)(?<date>.*)/m, /(?<=When did the impact start \(UTC\)\r\n\r\n)(?<date>.*)/m];
EndRegexFormat = [/(?<=When was the incident resolved \(UTC\)\r\n\r\n)(?<date>.*)/m];
DetectTimeRegexFormat = [/(?<=When did we detect the incident \(UTC\)\r\n\r\n)(?<date>.*)/m];

async function getIssue (octokit, owner, repo, issueNumber) {

  return await octokit.paginate('GET /repos/:owner/:repo/issues', {
    owner,
    repo,
    number: issueNumber
  });
}

async function run () {
 
 OWNER = process.env.OWNER;
 REPO = process.env.REPO;
 issue_number = parseInt(process.argv[2])
 const octokit = new Octokit({
    auth:process.env.PROJECT_TOKEN,
    previews:['inertia-preview']
    });
 console.log("issue number is", issue_number)
 const issue = await getIssue(octokit, OWNER, REPO, issue_number);
 console.log("issue length is", issue.length);
 console.log("body is ", issue[0])
    
 if (!getStartTime(issue[0].body) && !getDetectTime(issue[0].body) && !getEndTime(issue[0].body)) {
    console.log("start time body", getStartTime(issue[0].body))
    console.log("detect time body", getDetectTime(issue[0].body))
    console.log("end time body", getEndTime(issue[0].body))
    console.log(true)
 }
 else {
    console.log(false)
 }     
}

  function getStartTime(body){
    let startTimer = 0
    for(const regex of this.StartRegexFormat) {
      //console.log(body)
      const matches = body.match(regex || '') || [];
      //console.log(matches)
      if (matches?.length > 0) {
          const startDate = Date.parse(matches[1].trim().replace(/\.$/, ''));
          startTimer = isNaN(startDate) ? undefined : new Date(startDate);
          return startTimer
        }
    }
    return undefined
  }

  function getDetectTime(body){
    let detectTime = 0
    for(const regex of this.DetectTimeRegexFormat) {
        //console.log(body)
        const matches = body.match(regex || '') || [];
        //console.log(matches)
        if (matches?.length > 0) {
            const startDate = Date.parse(matches[1].trim().replace(/\.$/, ''));
            detectTime = isNaN(startDate) ? undefined : new Date(startDate);
            return detectTime;
          }
    }
  
    return undefined
  
  }

  function getEndTime(body){
    let detectTime = 0
    for(const regex of this.EndRegexFormat) {
        //console.log(body)
        const matches = body.match(regex || '') || [];
        //console.log(matches)
        if (matches?.length > 0) {
            const startDate = Date.parse(matches[1].trim().replace(/\.$/, ''));
            if(isNaN(startDate)){
              return undefined
            }
            else{
              detectTime = new Date(startDate)
              //detectTime.setUTCSeconds(startDate);
              return detectTime;
            }
          }
    }
  
    return undefined
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
