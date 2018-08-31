import React from 'react';

function EventList({events}) {
  return (
    <div>
      <h1>You have {events.length} calendar events</h1>
    </div>
  )
}

export default EventList;