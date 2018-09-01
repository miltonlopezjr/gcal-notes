import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import EventList from './components/EventList.jsx'


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      events: []
    }
    this.getEvents = this.getEvents.bind(this);
  }

  componentDidMount(){
    this.getEvents()
  }

  getEvents (){
    axios.get('/events')
    .then(({data}) => {
      console.log(data);
      this.setState({
        events: data
      })
    })
  }

  render(){
    return (
      <div>
        <h1>Hello {this.props.name}</h1>
        <EventList events={this.state.events} />
      </div>
    )
  }

}

ReactDom.render(<App name="Milton" />, document.getElementById('app'));