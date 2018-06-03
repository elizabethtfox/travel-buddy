import React, { Component } from 'react';
import NavBar from './components/NavBar.jsx';
import MapContainer from './components/MapContainer.jsx'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MapContainer />
      </div>
    );
  }
}

export default App;
