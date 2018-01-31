import React, { Component } from 'react';
import TileImage from './components/title-image';
import './App.css';

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const PicturePanel = ({ selectedDogs, selectedDog, randomizeDogs }) => {
  return (
    <div className="PictureHolder">
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
};

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

  componentWillMount = async () => {
    const breeds = await this.getBreeds()
    this.setState({ breeds });
    const images = await this.getBreedImages(breeds);
    this.setState({ images });
    this.randomizeDogs();
  }

  getBreeds = async () => {
    const response = await fetch('/api/breeds/list');
    const body = await response.json();

    if (response.status !== 200) { 
      throw Error(body.message);
    }
    else {
      return body.message;
    }
  };

  getBreedImages = async breeds => {
    return await Promise.all(breeds.map( async breed => {
      if (localStorage[breed]) {
        return localStorage[breed];
      } else {
        const image = await this.getBreedImage(breed);
        localStorage.setItem(breed, image);
        return image;
      }
    }))
  };

  getBreedImage = async breed => {
    const response = await fetch(`/api/breed/${breed}/images/random`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    else return body.message;
  };

  randomizeDogs() {
    const { breeds, images } = this.state;
    const selectedDogs = [];
    let selectedDog = '';
    const breedLength = breeds.length;

    for (var i = 0; i < 6; i++) {
      const index = Math.round(Math.random() * (breedLength - 1));
      const breed = breeds[index];
      const image = images[index];

      selectedDogs.push({ [breed]: image });

      selectedDog =
        selectedDog === ''
          ? breed
          : Math.random() * 1 < 0.5 ? breed : selectedDog;
    }

    this.setState({
      selectedDogs,
      selectedDog
    });
  }

  render() {
    const { breeds, images, selectedDogs, selectedDog } = this.state;

    if (!breeds.length || isEmpty(images)) {
      return (<div className="App" />);
    }

    return (
      <div className="App">
        <NamePanel selectedDog={selectedDog} />

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
