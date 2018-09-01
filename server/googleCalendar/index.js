const fs = require('fs')
const {google} = require('googleapis')
const path = require('path')

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.redirect_uris
);

function authorize (callback) {
  //check if we have previously stored token
  fs.readFile(path.join(__dirname,TOKEN_PATH), (err, token) => {
    if(err) {
      console.log(err)
      if(err.errno === -2){
        callback('Token not set');
      } else {
        callback(err)
      }
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(null, oAuth2Client);
    }
  })
}

function getAccessURL(callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  callback(authUrl);
}

function setAccessToken(code,callback){
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.err('Error retrieving access token', err);
      callback(err)
    }
    oAuth2Client.setCredentials(token);
    fs.writeFile(path.join(__dirname,TOKEN_PATH), JSON.stringify(token), (err) => {
      if (err) console.error(err);
      console.log('Token stored to', TOKEN_PATH);
      callback(null, 'Token stored');
    });
  });
}

// Lists the next 10 events on the user's primary calendar
function listEvents(auth,callback) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId : 'hackreactor.com_hbl8mohuo9as0fjv18jbn9t6i0@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 200,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if(err) { 
      console.log('The API returned an error: ', err);
      callback(err)
    }
    callback(null,res.data.items);
  });
} 

let getCalendarEvents = function getCalendarEvents(callback) {
  authorize((err, auth) => {
    if(err) {
      callback(err)
    }
    else {
      listEvents(auth, (err, events)=> {
        if(err) callback(err);
        callback(null, events);
      })
    }
  })
}

module.exports.getCalendarEvents = getCalendarEvents;
module.exports.getAccessURL = getAccessURL;
module.exports.setAccessToken = setAccessToken;