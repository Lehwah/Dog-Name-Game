import React, { Component } from 'react';

class NamePanel extends Component { 
    render() {
      const { selectedDog } = this.props
  
      return (<div className="ButtonHolder">
        <h1>{`Which doggie is a ${selectedDog}?`}</h1>
      </div>)
    }
  };

  export default NamePanel