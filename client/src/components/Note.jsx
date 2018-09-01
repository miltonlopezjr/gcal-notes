import React from 'react';

class Note extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
    <div className="noteText">
      <div className="noteIcons"><i class="fas fa-edit"></i><i class="fas fa-trash-alt"></i></div>
      <div>
        {this.props.note.text}
      </div>
    </div>
    )
  }
}

export default Note;