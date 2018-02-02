import React, { Component } from 'react';
import TileImage from './../title-image';

class PicturePanel extends Component {
  render() {
    const { selectedDogs,
            selectedDog,
            restart,
            randomizeDogs,
            startRestart,
            stopRestart } = this.props;

    return (
      <div className="pictures-holder">
        {selectedDogs.map((dogs, index) => {
          const dogName = Object.keys(dogs)[0];
          const imageSrc = dogs[dogName];
          const isAnswer = selectedDog === dogName;

          return (
            <TileImage
              key={index}
              dogName={dogName}
              imageSrc={imageSrc}
              randomizeDogs={randomizeDogs}
              isAnswer={isAnswer}
              restart={restart}
              startRestart={startRestart}
              stopRestart={stopRestart}
            />
          );
        })}
      </div>
    );
  }
}

export default PicturePanel;
