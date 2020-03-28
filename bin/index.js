#!/usr/bin/env node

fs = require('fs');
unzipper = require('unzipper');
console.log("Login");

const { GarminConnect } = require('garmin-connect');
const workingDir = process.cwd();
const downloadDir = workingDir + '/download/'
const extractionDir = downloadDir + '/extracted/'

// Has to be run in an async function to be able to use the await keyword
const main = async () => {
    const GCClient = new GarminConnect();
    await GCClient.login();
    const info = await GCClient.getUserInfo();
    console.log('Logged in as: ' + info.username);

    const activities = await GCClient.getActivities(0, 100);
    console.log('Received ' + activities.length + ' activities');
    
    fs.writeFile(downloadDir + 'activities.json', JSON.stringify(activities, null, 2), function (err) {
        if (err) return console.log(err);
    });


    let downloadedActivities = 0;
    for (activity of activities) {        
        const activityJson = downloadDir + activity.activityId + '.json';
        if (fs.existsSync(activityJson)) {
            console.log('Skipping: ' + activity.activityId + ': ' + activity.activityName + "@" + activity.startTimeLocal);
        } else {
            console.log('Downloading: ' + activity.activityId + ': ' + activity.activityName + "@" + activity.startTimeLocal);
            r = await GCClient.downloadOriginalActivityData(downloadDir, activity.activityId);
            if(r.endsWith('.zip')){
               extractFile(downloadDir + r);
            }
            fs.writeFile(activityJson, JSON.stringify(activity, null, 2), function (err) {
                if (err) return console.log(err);
            });
            downloadedActivities += 1;
        }
    }; 
    console.log(`Activities found ${activities.length}, downloaded: ${downloadedActivities}, skipped: ${activities.length - downloadedActivities}`);
   
};

function extractFile(zip){
    console.log('extracting: ' + zip + ' to: ' + extractionDir);
    fs.createReadStream(zip)
    .pipe(unzipper.Extract({ path: extractionDir }));
}

function extractAll(){
    const downloadedZips = fs.readdirSync(downloadDir).filter((v) => v.endsWith('.zip'));
    console.log(downloadedZips);

    for (zip of downloadedZips) {
        extractFile(zip);
    }
}

main();
