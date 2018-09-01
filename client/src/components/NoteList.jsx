import React from 'react';
import Note from './Note.jsx'
import axios from 'axios'

class NoteList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notes : [],
      inputNote: ''
    }
    this.getNotes = this.getNotes.bind(this);
    this.handleInputNoteChange = this.handleInputNoteChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.postNote = this.postNote.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
  }
  componentDidMount(){
    this.getNotes(this.props.eventId)
  }
  getNotes (eventId){
    console.log('getting..')
    axios.get(`/notes?eventId=${eventId}`)
    .then(({data}) => {
      this.setState({
        notes : data
      })
    })
    .catch((err) => {
      console.log(err``)
    })
  }
  deleteNote (note){
    axios.delete('/note', {data: 
      {
      eventId : this.props.eventId,
      noteText : note
    }})
    .then((res)=> {
      console.log('delted')
      this.getNotes(this.props.eventId)
    })
    .catch((err) => {
      console.log(err)
    })
  }
  handleInputNoteChange (event){
    this.setState({
      inputNote: event.target.value
    })
  }

  postNote (note) {
    axios.post('/note', {
      noteText : note,
      eventId : this.props.eventId
    })
    .then((res)=> {
      console.log('note saved!')
      this.setState({
        inputNote: ''
      })
      this.getNotes(this.props.eventId)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postNote(this.state.inputNote)
  }

  render (){
    //don't show unless show is true
    if(!this.props.showNotes) {
      return null;
    }

    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    }; 

    return (
    <div className="backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
        <div className="closeButton">
          <button onClick={this.props.onClose}>Close</button>
        </div>
        <h1>You have {this.state.notes.length} <u>{this.props.eventName}</u> notes!</h1>
        <div>
          {
            this.state.notes.map((note) => ( <Note key={note.text} note={note} eventid={this.props.eventId} deleteNote={this.deleteNote} /> ))
          }
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Add Note:
              <textarea value={this.state.inputNote} rows="10" cols="33" onChange={this.handleInputNoteChange} />
            </label>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
      </div>
    </div>
    )
  }
}

export default NoteList;