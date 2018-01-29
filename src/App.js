import React, { Component } from 'react';
import './App.css';

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

class TileImage extends Component {
  state = { clicked: false };
  getInitialState() {
    return {clicked: false};
  }
  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.name;
    const name = this.props.name;
    const prevClickStatus = prevState.clicked;
    const clickStatus = this.state.clicked;

    if(prevName !== name && prevClickStatus !== clickStatus) {
      this.setState({clicked: false});
    }
  }
  handleClick(e) {
    //In the future, allow this tile to know it is right/wrong from the beginning'
    this.setState({clicked: true});
    if(this.props.isAnswer) {
      this.props.randomizePairs();
      this.setState({clicked: false});
      //TODO: Add visual update for sucess and a timer/call back to call "randomize pairs" after success
      // setTimeout(this.props.randomizePairs(), 3000);
    }
  }

  render() {
    const { clicked } = this.state;
    const {name, imageSrc, isAnswer } = this.props;
    console.log(name, clicked)
    let overlayClass = (!clicked)? '' :
                       (isAnswer)?            'correct ':
                                              'incorrect ';
    const comboClass = 'overlay ' + overlayClass;
    return (
      <div style={{position: 'relative'}}>
        <img alt="No Content" src={this.props.imageSrc}></img>
        <div className={comboClass} onClick={e => this.handleClick()} ></div>
      </div>
    );
  }
}

const PicturePanel = ({selectedPairs, selectedDoggie, randomizePairs}) => {
  return (
    <div className="PictureHolder">
      {
        selectedPairs.map( (pair, key) => {
        var name = Object.keys(pair)[0];
        var imageSrc = pair[name];
        return <TileImage
                  key={key}
                  name={name}
                  imageSrc={imageSrc}
                  randomizePairs={randomizePairs}
                  isAnswer={selectedDoggie === name}
               />
        })
      }
    </div>
  );

}

const NamePanel = (props) => {
  const { selectedDoggie } = props;
  return (
    <div className="ButtonHolder">
      <h1>{`Which doggie is a ${selectedDoggie}?`}</h1>
    </div>
  );
};

class App extends Component {
  state = {
    breeds: [],
    images: {},
    selectedPairs: [],
    selectedDoggie: ''
  };

  componentWillMount() {
    this.getBreeds()
      .then( breeds => {
        this.setState({breeds});
        return breeds;
      })
      .then( async breedNames => {
        const images = await this.getBreedImages(breedNames);
        this.setState({images});
        //TODO fix images to not repeat the same image
        this.randomizePairs();
      })
      .catch( error => console.log(error));
  }

  shouldComponentUpdate() {
    return true;
  }

  getBreeds = async() => {
    const response = await fetch('/api/breeds/list');
    const body = await response.json();

    if ( response.status !== 200 ) throw Error(body.message);
    else return body.message;
  }

  getBreedImages = async breedNames => {
    let breedImages = {};
    for(const breedName of breedNames) {
      let breedImage = localStorage[breedName];

      if(breedImage) {
        breedImages[breedName] = breedImage;
      }
      else {
        breedImage = await this.getBreedImage(breedName)
        localStorage.setItem(breedName, breedImage);
        breedImages[breedName] = breedImage;
      }
    }
    return breedImages;
  }

  getBreedImage = async breedName => {
    const response = await fetch(`/api/breed/${breedName}/images/random`);
    const body = await response.json();

    if(response.status !== 200) throw Error(body.message);
    else return body.message;
  }

  getImageKey(value) {
    const {images} = this.state;
    for(var prop in images) {
      if(images.hasOwnProperty( prop) ) {
        if(images[prop] === value) {
          return prop;
        }
      }
    }
  }

  randomizePairs() {
    function getRandomIndex(range) {
      return Math.round(Math.random() * range);
    }

    const { breeds, images } = this.state;
    var newPairs = [];
    var newName = '';
    var breedLength = breeds.length;
    for(var i = 0; i < 6; i++) {
      var index = getRandomIndex(breedLength);
      var breedName = breeds[index];
      var breedImage = images[breedName];
      newPairs.push({[breedName]: breedImage});
      newName = (newName === '')?     breedName :
                (Math.random() * 1 < 0.5)? breedName : newName;
    }
    this.setState({
      selectedPairs: newPairs,
      selectedDoggie: newName
    });
  }

  render() {
    const { breeds, images, selectedPairs, selectedDoggie } = this.state;
    const breedLength = breeds.length;

    if(breeds.length === 0 || isEmpty(images)) {
      return <div className="App"></div>
    }

    return (
      <div className="App">
        <NamePanel selectedDoggie={selectedDoggie}/>

        <PicturePanel
          selectedPairs={selectedPairs}
          selectedDoggie={selectedDoggie}
          randomizePairs={this.randomizePairs.bind(this)}
        />
      </div>
    );
  }
}

export default App;
