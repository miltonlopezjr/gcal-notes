import React from 'react';

class EventList extends React.Component {
  constructor(props){
    super(props);
    this.setTime = this.setTime.bind(this);
  }
  setTime (){
    //check if start.dateTime is defined
    if(this.props.event.start.dateTime) {
      let start = new Date(this.props.event.start.dateTime);
      let end = new Date(this.props.event.end.dateTime);
      return `${start} - ${end}`;
    } else {
      return this.props.event.start.date;
    }
  }
  render() {
    return (
    <div>
      <div className="title">{this.props.event.summary}</div>
      <div className="time">
        {this.setTime()}
      </div>
    </div>
    )
  }
}

export default EventList;