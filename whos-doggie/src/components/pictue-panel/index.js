import React, { Component } from 'react';
import TileImage from './../title-image';

class PicturePanel extends Component {
  render() {
    const { selectedDogs, selectedDog, randomizeDogs } = this.props;

    return (
      <div className="pictures-holder">
        {selectedDogs.map((dogs, index) => {
          const dogName = Object.keys(dogs)[0];
          const imageSrc = dogs[dogName];

          return (
            <TileImage
              key={index}
              dogName={dogName}
              imageSrc={imageSrc}
              randomizeDogs={randomizeDogs}
              isAnswer={selectedDog === dogName}
            />
          );
        })}
      </div>
    );
  }
}

export default PicturePanel;
