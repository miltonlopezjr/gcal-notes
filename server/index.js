const express = require('express')
const axios = require('axios')
const body = require('body-parser')
const cors = require('cors')
const env = require('dotenv').config()
const path = require('path')
const {getCalendarEvents, getAccessURL,setAccessToken} = require('./googleCalendar/index')

const app = express()

app.use(body.json())
app.use(cors())

app.use(express.static(path.join(__dirname, '/../client/dist')))

app.get('/events', (req, res) => {
  getCalendarEvents((err, events) => {
    if(err) res.send(err)
    res.send(events);
  })
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
