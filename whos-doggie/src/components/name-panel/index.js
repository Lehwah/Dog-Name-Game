import React, { Component } from 'react';

class NamePanel extends Component {
  render() {
    const { selectedDog } = this.props;

    return (
      <div className="title-name">
        {`Which doggie is a ${selectedDog}?`}
      </div>
    );
  }
}

export default NamePanel;
