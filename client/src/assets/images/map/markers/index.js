import crosshairs from './crosshairs.png';
import lhq from './lhq.png';
import pin from './pin.png';

const mapMarker = (name) => {
  const markersLibrary = {
    scene: {
      uri: crosshairs,
    },
    lhq: {
      uri: lhq,
    },
  };
  return (markersLibrary[name] ? markersLibrary[name].uri : pin);
};


export default mapMarker;
