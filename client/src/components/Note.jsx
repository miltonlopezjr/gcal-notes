import React from 'react';

class Note extends React.Component {
  constructor(props){
    super(props);
  }

  addNote () {
    
  }

  render() {
    return (
    <div>
      <div className="title">{this.props.note.name}</div>
      <div className="text">
        {this.props.note.text}
      </div>
    </div>
    )
  }
}

export default Note;