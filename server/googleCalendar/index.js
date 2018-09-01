const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')
const path = require('path')
const alert = require('alert-node')

//if modifying these scopes, delete token.json = credentials.json?
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.redirect_uris
);


// function getCreds (callback){
//   //Load client secrets from a local file.
//   fs.readFile(path.join(__dirname,'/credentials.json'), (err, content) => {
//     if(err) return console.log('Error loading client secret file: ', err);
//     // Authorize a client with creds, then call the google calendar API
//     authorize(JSON.parse(content), callback);
//   });
// }

function authorize (callback) {
  // const {client_secret, client_id, redirect_uris} = credentials.installed;
  
  //check if we have previously stored token
  fs.readFile(path.join(__dirname,TOKEN_PATH), (err, token) => {
    if(err) {
      console.log(err)
      callback(err);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(null, oAuth2Client);
  })
}

// get and store new token after prompting for user auth, then execute
// callback with authorized OAuth2 client
function getAccessURL(callback) {
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  callback(authUrl);

  // console.log('Authorize this app by visiting this url :', authUrl);
  // alert('Authorize this app by visiting this url :', authUrl)
  // const r1 = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // r1.question('Enter the code from that page here :', (code) => {
  //   r1.close();
    
  // });
}

function setAccessToken(code,callback){
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.err('Error retrieving access token', err);
      callback(err)
    }
    oAuth2Client.setCredentials(token);
    // store token to disk for later program exectuions
    fs.writeFile(path.join(__dirname,TOKEN_PATH), JSON.stringify(token), (err) => {
      if (err) console.error(err);
      console.log('Token stored to', TOKEN_PATH);
      callback(null, 'Token stored');
    });
    // callback(null, oAuth2Client);
  });
}

// Lists the next 10 events on the user's primary calendar
function listEvents(auth,callback) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId : 'hackreactor.com_hbl8mohuo9as0fjv18jbn9t6i0@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 25,
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
    if(err) callback(err)
    listEvents(auth, (err, events)=> {
      if(err) callback(err);
      // let eventsArry = events.map((event) => {
      //   return {
      //     id: event.id,
      //     summary: event.summary
      //   }
      // })
      callback(null, events);
      // if(events.length) {
      //   console.log('Upcoming 10 events:');
      //   events.map((event,i) => {
      //     const start = event.start.dateTime || event.start.date;
      //     console.log(`${start} - ${event.summary}`);
      //   });
      // } else {
      //   console.log('No upcoming events found.');
      // }
    })
  })
}

module.exports.getCalendarEvents = getCalendarEvents;
module.exports.getAccessURL = getAccessURL;
module.exports.setAccessToken = setAccessToken;