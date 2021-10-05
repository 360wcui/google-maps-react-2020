import React from "react";
import {GoogleMap, GroundOverlay, Marker, useLoadScript,} from "@react-google-maps/api";
import img1 from './images/000000001.jpg'
import img2 from './images/000000002.jpg'
import "@reach/combobox/styles.css";
import Search from "./Search";
import {center, mapContainerStyle, options, libraries} from "./variables";


export default function App() {
    const {isLoaded, loadError} = useLoadScript({
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

    const panTo = React.useCallback(({lat, lng}) => {
        mapRef.current.panTo({lat, lng});
        mapRef.current.setZoom(20);
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div>
            <Search panTo={panTo}/>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={20}
                center={center}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                <GroundOverlay
                    url={img1}
                    bounds={new window.google.maps.LatLngBounds(
                        new window.google.maps.LatLng(38.984398443116966, -76.94956330265015),
                        new window.google.maps.LatLng(38.98505681995151, -76.94870550950368)
                    )}
                    onClick={onMapClick}
                />

                <GroundOverlay
                    // url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
                    url={img2}
                    bounds={new window.google.maps.LatLngBounds(
                        new window.google.maps.LatLng(38.98375532067455, -76.94956703026241),
                        new window.google.maps.LatLng(38.984468864794344, -76.94870415014813)
                    )}
                    onClick={onMapClick}
                />
                {markers.map((marker) => (
                    <Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{lat: marker.lat, lng: marker.lng}}
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

