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
  state = { clicked: false, gameRestart: false};

  componentDidUpdate(prevProps, prevState) {
    const prevDogName = prevProps.dogName;
    const { dogName } = this.props;
    const { gameRestart } = this.props;
    if(prevDogName !== dogName && gameRestart) {
      this.setState({clicked: false, gameRestart: true});
    } 
  }

  handleClick(e) {
    //TODO: Currently, dogs can be clicked even when the correct one is already clicked
    const { clicked } = this.state;
    const { isAnswer } = this.props;

    this.setState({clicked: true, gameRestart: true});

    if(isAnswer && !clicked) {
      setTimeout(() => {
        this.resetTile()
      }, 1500);
    } 
  }
  resetTile() {
    this.setState({clicked: false});

    this.props.randomizeDogs();
  }

  render() {
    const { clicked } = this.state;
    const {dogName, imageSrc, isAnswer } = this.props;

    let overlayClass = (!clicked)? '' :
                       (isAnswer)? 'correct ':
                                   'incorrect ';
    const comboClass = 'overlay ' + overlayClass;

    return (
      <div style={{position: 'relative'}}>
        <img alt="No Content" src={imageSrc}></img>
        <div className={comboClass} onClick={e => this.handleClick()} >
          {
            (clicked)? dogName: ''
          }
        </div>
      </div>
    );
  }
}

const PicturePanel = ({selectedDogs, selectedDog, randomizeDogs}) => {
  return (
    <div className="PictureHolder">
      {
        selectedDogs.map( (dogs, index) => {
        var dogName = Object.keys(dogs)[0];
        var imageSrc = dogs[dogName];

        return <TileImage
                  key={index}
                  dogName={dogName}
                  imageSrc={imageSrc}
                  randomizeDogs={randomizeDogs}
                  isAnswer={selectedDog === dogName}
               />
        })
      }
    </div>
  );

}

const NamePanel = ({ selectedDog }) => {
  return (
    <div className="ButtonHolder">
      <h1>{`Which doggie is a ${selectedDog}?`}</h1>
    </div>
  );
};

class App extends Component {
  state = {
    breeds: [],
    images: {},
    selectedDogs: [],
    selectedDog: ''
  };

  componentWillMount() {
    this.getBreeds()
      .then( breeds => {
        this.setState({breeds});
        return breeds;
      })
      .then( async breeds => {
        const images = await this.getBreedImages(breeds);
        this.setState({images});
        
        this.randomizeDogs();//TODO: fix images to not repeat the same image
      })
      .catch( error => console.log(error));
  }

  getBreeds = async() => {
    const response = await fetch('/api/breeds/list');
    const body = await response.json();

    if ( response.status !== 200 ) throw Error(body.message);
    else return body.message;
  }

  getBreedImages = async breeds => {
    let images = {};
    for(const breed of breeds) {
      let image = localStorage[breed];

      if(image) {
        images[breed] = image;
      }
      else {
        image = await this.getBreedImage(breed)
        localStorage.setItem(breed, image);
        images[breed] = image;
      }
    }
    return images;
  }

  getBreedImage = async breed => {
    const response = await fetch(`/api/breed/${breed}/images/random`);
    const body = await response.json();

    if(response.status !== 200) throw Error(body.message);
    else return body.message;
  }

  randomizeDogs() {
    const { breeds, images } = this.state;
    var selectedDogs = [];
    var selectedDog = '';
    var breedLength = breeds.length;

    for(var i = 0; i < 6; i++) {
      var index = Math.round(Math.random() * (breedLength - 1));
      var breed = breeds[index];
      var image = images[breed];

      selectedDogs.push({[breed]: image});

      selectedDog = (selectedDog === '')?      breed :
                    (Math.random() * 1 < 0.5)? breed : selectedDog;
    }
    
    this.setState({
      selectedDogs,
      selectedDog
    });
  }

  render() {
    const { breeds, images, selectedDogs, selectedDog } = this.state;
    const breedLength = breeds.length;

    if(breedLength === 0 || isEmpty(images)) {
      return <div className="App"></div>
    }

    return (
      <div className="App">
        <NamePanel selectedDog={selectedDog}/>

        <PicturePanel
          selectedDogs={selectedDogs}
          selectedDog={selectedDog}
          randomizeDogs={() => this.randomizeDogs()}
        />
      </div>
    );
  }
}

export default App;
