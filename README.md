# garmin-activity-downloader
Download activities and original files from garmin connect

add a `garmin.config.json` with your username and password.

```json
{
	"username": "my.email@example.com",
	"password": "MySecretPassword" 
}
```

Run the script with `node .`
Number of activities to be downloaded and offset can be changed in `/bin/index.js`  in `GCClient.getActivities(0, 100);`
