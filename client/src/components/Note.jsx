import React from 'react';

class Note extends React.Component {
  constructor(props){
    super(props);
    this.editNote = this.editNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }
  editNote (){
    console.log('edit')
  }
  deleteNote (){
    this.props.deleteNote(this.props.note.text)
  }
  
  render() {
    return (
    <div className="noteText">
      <div className="noteIcons"><i onClick={this.editNote} className="fas fa-edit"></i><i onClick={this.deleteNote} className="fas fa-trash-alt"></i></div>
      <div>
        {this.props.note.text}
      </div>
    </div>
    )
  }
}

export default Note;