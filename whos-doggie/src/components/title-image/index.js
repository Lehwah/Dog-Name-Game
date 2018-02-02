import React, { Component } from 'react';

class TileImage extends Component {
  state = { clicked: false };

  componentDidUpdate(prevProps, prevState) {
    const { restart } = this.props;

    if(restart) {
      this.setState({clicked: false});
      this.props.stopRestart();
    }
    // const prevDogName = prevProps.dogName;
    // const { dogName } = this.props;
    // if ( prevDogName !== dogName) {
    //   this.setState({ clicked: false });
    // }
  }

  resetTile() {
    this.setState({clicked: false});

    this.props.randomizeDogs();
    this.props.startRestart();
  }

  handleClick(e) {
    //TODO: Currently, dogs can be clicked even when the correct one is already clicked
    const { clicked } = this.state;
    const { isAnswer } = this.props;

    this.setState({clicked: true});

    if(isAnswer && !clicked) {
      setTimeout(() => {
        this.resetTile()
      }, 1500);
    }
    // const { clicked } = this.state;
    // const { isAnswer } = this.props;
    //
    // this.setState({ clicked: true });
    //
    // if (isAnswer && !clicked) {
    //   setTimeout(() => {
    //     this.props.randomizeDogs();
    //   }, 500);
    // }
  }

  render() {
    const { clicked } = this.state;
    const { dogName, imageSrc, isAnswer } = this.props;

    let overlayClass = !clicked ? '' : isAnswer ? 'correct ' : 'incorrect ';
    const comboClass = 'overlay ' + overlayClass;

    return (
      <div className="dog-block">
        <img alt="No Content" src={imageSrc} />
        <div className={comboClass} onClick={e => this.handleClick()}>
          {clicked ? dogName : ''}
        </div>
      </div>
    );
  }
}

export default TileImage;
