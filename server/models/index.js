const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI)

let eventSchema = mongoose.Schema({
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

let noteSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name : String,
  text : String,
  created : {
    type : Date,
    default: Date.now
  },
  id_Event : Number
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

let saveNotes = (notes, eventId) => {
  return Promise.all (
    notes.map((note) => {
      return Note.findOneAndUpdate(
        { id : note.id },
        {
          id : note.id,
          name : name,
          text : text,
          id_Event : eventId
        },
        { upsert : true }
      ).exec()
    })
  )
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
      id_Event : eventID, 
      created : {
        $exists : true,
        $ne: null
      }
    })
    .sort('+created')
    .exec()
}

module.exports.retrieveNotes = retrieveNotes
module.exports.retrieveAllDayEvents = retrieveAllDayEvents
module.exports.retrieveDailyEvents = retrieveDailyEvents
module.exports.saveNotes = saveNotes
module.exports.saveEvents = saveEvents