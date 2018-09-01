import React from 'react';
import Event from './Event.jsx'

const EventList = ({events}) => (
    <div>
      <h1>You have {events.length} calendar events!</h1>
      {
        events.map((event) => ( <Event key={event.id} event={event} /> ))
      }
    </div>
)

export default EventList;