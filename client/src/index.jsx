import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import EventList from './components/EventList.jsx'


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dailyEvents: [],
      allDayEvents: [],
      authURL : false
    }
    this.getEvents = this.getEvents.bind(this);
    this.getAuthURL = this.getAuthURL.bind(this);
    this.getLoadEvents = this.getLoadEvents.bind(this);
  }

  componentDidMount(){
    this.getEvents()
  }

  getAuthURL (url){
    this.setState({
      authURL : url
    })
  }

  getLoadEvents (){
    axios.get('/loadEvents')
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  getEvents (){
    axios.get('/events')
    .then(({data}) => {
      console.log(data);
      if(data === "Token not set"){
        console.log(data.length)
        //login
        axios.get('/getAccessURL')
        .then(({data}) => {
          this.getAuthURL(data);
        })
        .catch ((err) => {
          console.log(err);
        })
      } else if (data.length) {
        this.setState({
          dailyEvents: data
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render(){
    return (
      <div>
        <div>
          <button onClick={this.getLoadEvents()}>Load Events</button>
        </div>
        { this.state.authURL ? <div>Please login:<a href={this.state.authURL}>Here</a></div> : <div><h1>Hello {this.props.name}</h1><EventList events={this.state.dailyEvents} /></div> }        
      </div>
    )
  }

}

ReactDom.render(<App name="Milton" />, document.getElementById('app'));