const express = require('express')
const axios = require('axios')
const body = require('body-parser')
const cors = require('cors')
const config = require('dotenv').config()
const path = require('path')
const {getCalendarEvents,getAccessURL, setAccessToken} = require('./googleCalendar')
const db = require('./models')

const app = express()

app.use(body.json())
app.use(cors())

app.use(express.static(path.join(__dirname, '/../client/dist')))

app.get('/loadEvents', (req, res) => {
  getCalendarEvents((err, events) => {
    if(err) {
      console.log(err);
    }
    //get save to DB
    db.saveEvents(events)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(() => {
        res.sendStatus(500);
      })
  })
})

app.get('/events', (req, res) => {
  db.retrieveDailyEvents()
    .then((events) => {
      res.send(events)
    })
    .catch((err) => {
      res.end(err);
    })
})

app.get('/notes', (req, res) => {
  if(req.query.eventId){
    db.retrieveNotes(req.query.eventId)
    .then((notes) => {
      res.send(notes)
    })
    .catch((err) => {
      res.end(err);
    })
  }
  else{
    res.send('no eventID')
  }
})

app.get('/getAccessURL', (req, res) => {
    getAccessURL((authURL) => {
      res.send(authURL);
    });
})

app.get('/setAccessToken', (req, res) => {
  if(req.query.code){
    setAccessToken(req.query.code, (err,data) => {
      if(err) res.send(err);
      res.redirect('/')
    });
  }
})

app.listen(process.env.PORT, () => console.log('App listening..'))
