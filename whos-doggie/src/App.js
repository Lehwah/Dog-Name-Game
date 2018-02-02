import React, { Component } from 'react';
import PicturePanel from './components/pictue-panel';
import NamePanel from './components/name-panel';
import './App.css';

const gameTileCount = 6;

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

class App extends Component {
  state = {
    breeds: [],
    images: {},
    selectedDogs: {},
    selectedDog: '',
    restart: false
  };

  componentWillMount = async () => {
    const breeds = await this.getBreeds();
    this.setState({ breeds });
    const images = await this.getBreedImages(breeds);
    this.setState({ images });
    this.randomizeDogs();
  };

  getBreeds = async () => {
    const response = await fetch('/api/breeds/list');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    } else {
      return body.message;
    }
  };

  getBreedImages = async breeds => {
    return await Promise.all(
      breeds.map(async breed => {
        if (localStorage[breed]) {
          return localStorage[breed];
        } else {
          const image = await this.getBreedImage(breed);
          localStorage.setItem(breed, image);
          return image;
        }
      })
    );
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

    for (let i = 0; i < gameTileCount; i++) {
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

  startRestart() { this.setState({restart: true})}

  stopRestart() { this.setState({restart: false})}

  render() {
    const { breeds, images, selectedDogs, selectedDog } = this.state;
    if (!breeds.length || isEmpty(images)) {
      return <div className="App" />;
    }

    return (
      <div className="App">
        <NamePanel selectedDog={selectedDog} />

        <PicturePanel
          selectedDogs={selectedDogs}
          selectedDog={selectedDog}
          restart={restart}
          randomizeDogs={() => this.randomizeDogs()}
          startRestart={() => this.startRestart()}
          stopRestart={() => this.stopRestart()}
        />
      </div>
    );
  }
}

export default App;
