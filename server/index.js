const express = require('express')
const axios = require('axios')
const body = require('body-parser')
const cors = require('cors')
const env = require('dotenv').config()
const path = require('path')

const app = express()

app.use(body.json())
app.use(cors())

app.use(express.static(path.join(__dirname, '/../client/dist')))

app.get('/events', (req, res) => {
  let rtn = [];
  rtn.push(['test']);
  rtn.push(['test2']);

  res.send(rtn);
})

app.listen(process.env.PORT, () => console.log('App listening..'))
