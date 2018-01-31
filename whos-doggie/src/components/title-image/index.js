import React, { Component } from 'react';

class TileImage extends Component {
  state = { clicked: false, gameRestart: false };

  componentDidUpdate(prevProps, prevState) {
    const prevDogName = prevProps.dogName;
    const { dogName } = this.props;
    const { gameRestart } = this.props;
    if (prevDogName !== dogName && gameRestart) {
      this.setState({ clicked: false, gameRestart: true });
    }
  }

  handleClick(e) {
    const { clicked } = this.state;
    const { isAnswer } = this.props;

    this.setState({ clicked: true, gameRestart: true });

    if (isAnswer && !clicked) {
      setTimeout(() => {
        this.resetTile();
      }, 1500);
    }
  }
  resetTile() {
    this.setState({ clicked: false });
    this.props.randomizeDogs();
  }

  render() {
    const { clicked } = this.state;
    const { dogName, imageSrc, isAnswer } = this.props;

    let overlayClass = !clicked ? '' : isAnswer ? 'correct ' : 'incorrect ';
    const comboClass = 'overlay ' + overlayClass;

    return (
      <div style={{ position: 'relative' }}>
        <img alt="No Content" src={imageSrc} />
        <div className={comboClass} onClick={e => this.handleClick()}>
          {clicked ? dogName : ''}
        </div>
      </div>
    );
  }
}

export default TileImage;