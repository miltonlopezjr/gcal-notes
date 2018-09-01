import React from 'react';
import NoteList from './NoteList.jsx';
import moment from 'moment';

class Event extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false
    };
    this.setTime = this.setTime.bind(this);
    this.toggleNotes = this.toggleNotes.bind(this);
  }
  setTime (){
      let start = moment(this.props.event.startTime).format('MMMM Do YYYY, h:mm:ss a');
      let end = moment(this.props.event.endTime).format('MMMM Do YYYY, h:mm:ss a');
      return `${start} - ${end}`;
  }
  toggleNotes () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
    <div className="event">
      <div className="title">{this.props.event.summary}</div>
      <div className="time">
        {this.setTime()}
      </div>
    { this.state.isOpen ? (<NoteList showNotes={this.state.isOpen} onClose={this.toggleNotes} eventName={this.props.event.summary} eventId={this.props.event.id}/>) : (<div><button onClick={this.toggleNotes}>Show notes</button></div>) }
    </div>
    )
  }
}

export default Event;