var Twitter = require('twitter');
var fs = require('fs');
var Twit = require('twit');

var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);

//Authentication into Twitter
var client = new Twitter
({
    access_token_secret: ParsedCredentials.twitter[0].access_token_secret,
    access_token_key: ParsedCredentials.twitter[0].access_token_key,
    consumer_secret: ParsedCredentials.twitter[0].consumer_secret,
    consumer_key: ParsedCredentials.twitter[0].consumer_key
});

var T = new Twit({
    consumer_key: ParsedCredentials.twitter[0].consumer_key,
    consumer_secret: ParsedCredentials.twitter[0].consumer_secret,
    access_token: ParsedCredentials.twitter[0].access_token_key,
    access_token_secret: ParsedCredentials.twitter[0].access_token_secret,
  })

setTimeout(sendMessage, 100);

function sendMessage()
{
  var replyTo = 
  {
      'event': 
      {
          'type': 'message_create',
          'message_create': 
          {
              'target': 
              {
                'id': 'disturbedboy69'
              },
              'message_data': 
              {
                'text': 'You are going to be killed by robots one day!',
              }
        }
      }
  }

  T.post('direct_messages/events/new', replyTo, function(err,data,response)
  {
    console.info(data);
  });
}