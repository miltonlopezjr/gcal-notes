const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI)

let eventSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  summary: String,
  description: String,
  startTime : Date,
  endTime : Date,
  startDate : Date,
  endDate : Date
})

let noteSchema = new mongoose.Schema({
  text : {
    type: String,
    unique: true
  },
  created : {
    type : Date,
    default: Date.now
  },
  id_Event : String
})

let Event = mongoose.model('Event', eventSchema)
let Note = mongoose.model('Note', noteSchema)

let saveEvents = (events) => {
  return Promise.all(
    events.map((event) => {
      return Event.findOneAndUpdate(
        { id : event.id },
        {
          id: event.id,
          summary : event.summary,
          description : event.description,
          startTime : event.start.dateTime,
          endTime : event.end.dateTime,
          startDate : event.start.date,
          endDate : event.end.date
        },
        { upsert: true }
      ).exec()
    })
  )
}

let saveNote = (noteText, eventId, callback) => {
    Note.findOneAndUpdate(
      { text : noteText },
      {
        text : noteText,
        id_Event : eventId
      },
      { upsert : true }
    ).exec((err, note) => {
      if(err) callback(err)
      callback(null, note)
    })
}

let retrieveAllDayEvents = () => {
  let today = Date.now()
  let maxDate = new Date(today).setMonth(new Date(today).getMonth() + 1);
  return Event.find(
    {
      startDate: {
        $exists : true,
        $ne: null,
        $gte: new Date(today),
        $lt: new Date(maxDate)}
    })
    .sort('+startDate')
    .exec()
}

let retrieveDailyEvents = () => {
  let today = Date.now()
  let maxDate = new Date(today).setMonth(new Date(today).getMonth() + 1);
  return Event.find(
    {
      startTime: {
        $exists : true,
        $ne: null,
        $gte: new Date(today),
        $lt: new Date(maxDate)}
    })
    .sort('+startTime')
    .exec()
}

let retrieveNotes = (eventID) => {
  return Note.find(
    {
      id_Event : eventID
    })
    .sort('+eventID')
    .exec()
}

module.exports.retrieveNotes = retrieveNotes
module.exports.retrieveAllDayEvents = retrieveAllDayEvents
module.exports.retrieveDailyEvents = retrieveDailyEvents
module.exports.saveNote = saveNote
module.exports.saveEvents = saveEvents