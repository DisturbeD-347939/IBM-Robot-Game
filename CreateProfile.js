var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var Twitter = require('twitter');
var fs = require('fs');
var rimraf = require("rimraf");

//Authentication into the Personality Insight API
var personalityInsights = new PersonalityInsightsV3({
  version: '2019-03-22',
  iam_apikey: 'YMpOWrKJysOg9xdNt3HNIcpnVqZHve-_VaVKkq4cokxi',
  url: 'https://gateway-lon.watsonplatform.net/personality-insights/api'
});

//Authentication into Twitter
var client = new Twitter({
  consumer_key: 'PX8hDcf9YHAKqXII5TdhlHMVw',
  consumer_secret: 'FFb7qceLkOXSa0GnLMgzItSeIYsmpckxToTZe0jUHPVMRNeWPV',
  access_token_key: '3135731542-Amvbgvz8s1t0v80KW4TCLnoFfNzUIBSJuWwXvWM',
  access_token_secret: 'Bja7LysYPFqkMubC8i9d8R1GljlTozLjtWtIRu52BVz6F'
});

var text = "";
GLOBAL.outputText = "";
GLOBAL.id = "";

//Create question template
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

  //Get tweets from user timeline
client.get('statuses/user_timeline', {screen_name: id, count: '100', include_rts: 'false'} , function(error, tweets, response)
{
    //Make them json
    var data = JSON.stringify(tweets, null, 2);
    //Clean them
    let profileText = JSON.parse(data);
    outputText += "{ \"contentItems\" : [\n\n";
    //Take tweet text
    for(var i = 0; i < profileText.length;   i++)
    {
        text =  profileText[i].text;
        text = text.replace(/(\r\n|\n|\r)/gm," ");
        text = text.replace(/"/g, '');
        
        outputText += "{\n\t\"content\":\"" + text + "\",\n\t\"contenttype\": \"text/plain\",\n\t\"created\":" + 0 + ",\n\t\"id\":\"" + profileText[i].id + "\",\n\t\"language\":\"en\"\n}";
        
        if((i+1) != profileText.length)
            {
                outputText += ",\n";
            }
    }
    outputText += "]}";
    
    if (!fs.existsSync('./Users/' + ID))
    {
        fs.mkdirSync('./Users/' + ID);
    }
    
    fs.writeFileSync('./Users/' + ID + '/profile.json', outputText);
    var profileParams = {
        // Get the content from the JSON file.
        content: require('./Users/' + ID + '/profile.json'),
        content_type: 'application/json',
        consumption_preferences: 'true'
    };
    //Gets the information from the Personality Insight tool belonging to the Watson AI
    personalityInsights.profile(profileParams, function(error, profile) {
        if (error) 
        {
            console.log("FAILED! Error code - " + error.code);
            console.log("Deleting profile...");
            rimraf.sync('./Users/' + ID);
            console.log("Profile deleted!");
        } 
        else 
        { 
            var filtered = "";
            for(var i = 0; i < profile.personality.length; i++)
                {
                    console.log(profile.personality[i].name + " " + profile.personality[i].percentile + "\n");
                    filtered += profile.personality[i].name + " " + profile.personality[i].percentile + "\n";
                }
            fs.writeFileSync('./Users/' + ID + '/outputUnity.txt', filtered);
            fs.writeFileSync('./Users/' + ID + '/outputRawUnity.json', JSON.stringify(profile, null, 2));
        }
    });
})
  readline.close()
)