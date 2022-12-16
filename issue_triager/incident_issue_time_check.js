
const date = '2022-11-01T00:00:00Z'
StartRegexFormat = [/(?<=When did the incident start \(UTC\)\r\n\r\n)(?<date>.*)/m, /(?<=When did the impact start \(UTC\)\r\n\r\n)(?<date>.*)/m];
EndRegexFormat = [/(?<=When was the incident resolved \(UTC\)\r\n\r\n)(?<date>.*)/m];
DetectTimeRegexFormat = [/(?<=When did we detect the incident \(UTC\)\r\n\r\n)(?<date>.*)/m];

process.argv.forEach(function (val) {
    console.log(val);
    body = val[2]
    if (!getStartTime(body) && !getDetectTime(body) && !getEndTime(body))
        console.log(true)
    console.log(false)

  });

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
