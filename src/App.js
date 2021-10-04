import React from "react";
import {GoogleMap, GroundOverlay, Marker, useLoadScript,} from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng,} from "use-places-autocomplete";
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover,} from "@reach/combobox";
import img1 from './images/000000001.jpg'
import img2 from './images/000000002.jpg'
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  // mapTypeId: "satellite"
};
const center = {
  lat: 38.9947278,
  lng: -76.9491321,
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    console.log(e.latLng.lat(), e.latLng.lng());
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(20);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>

      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={20}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {/*lat: 38.9947278,*/}
  {/*lng: -76.9491321,*/}

      <GroundOverlay
      // url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
      // url="https://github.com/360wcui/google-maps-react-2020/blob/master/src/images/newark_nj_1922.jpg"
      url={img1}
      bounds={new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(38.9847278, -76.9491321),
        new window.google.maps.LatLng(38.9841278, -76.9485321)
      )}
      onClick={onMapClick}
      // defaultOpacity={.5}
    />

    <GroundOverlay
      // url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
      // url="https://github.com/360wcui/google-maps-react-2020/blob/master/src/images/newark_nj_1922.jpg"
      url={img2}
      bounds={new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(38.9841278, -76.9491321),
        new window.google.maps.LatLng(38.9835278, -76.9485321)
      )}
      onClick={onMapClick}
      // defaultOpacity={.5}
    />
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: `/logo192.png`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

      </GoogleMap>
    </div>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
