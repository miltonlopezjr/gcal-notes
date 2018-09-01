import React from 'react';
import NoteList from './NoteList.jsx';

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
      let start = new Date(this.props.event.startTime);
      let end = new Date(this.props.event.endTime);
      return `${start} - ${end}`;
  }
  toggleNotes () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
    <div>
      <div className="title">{this.props.event.summary}</div>
      <div className="time">
        {this.setTime()}
      </div>
    { this.state.isOpen ? (<NoteList showNotes={this.state.isOpen} onClose={this.toggleNotes} eventId={this.props.event.id}/>) : (<div><button onClick={this.toggleNotes}>Show notes</button></div>) }
    </div>
    )
  }
}

export default Event;