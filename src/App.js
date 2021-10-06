import React from "react";
import {GoogleMap, GroundOverlay, Marker, useLoadScript,} from "@react-google-maps/api";
import img1 from './images/000000001.jpg'
import img2 from './images/000000002.jpg'
import "@reach/combobox/styles.css";
import Search from "./Search";
import {
    center,
    mapContainerStyle,
    options,
    libraries,
    drone_image_base_lat,
    drone_image_increment,
    drone_image_base_lng
} from "./variables";


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
    const img1_sw_lat = drone_image_base_lat - drone_image_increment * 1.097 / 2;
    const img1_sw_lng = drone_image_base_lng - drone_image_increment * 1.422  / 2;
    const img1_ne_lat = drone_image_base_lat + drone_image_increment * 1.097 / 2;
    const img1_ne_lng = drone_image_base_lng + drone_image_increment * 1.422 / 2;

    const img2_sw_lat = drone_image_base_lat - drone_image_increment - drone_image_increment * 1.097 / 2;
    const img2_sw_lng = drone_image_base_lng - drone_image_increment * 1.422  / 2;
    const img2_ne_lat = drone_image_base_lat - drone_image_increment + drone_image_increment * 1.097 / 2;
    const img2_ne_lng = drone_image_base_lng + drone_image_increment * 1.422 / 2;
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
                        new window.google.maps.LatLng(img1_sw_lat, img1_sw_lng),
                        new window.google.maps.LatLng(img1_ne_lat, img1_ne_lng)
                    )}
                    onClick={onMapClick}
                />

                <GroundOverlay
                    // url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
                    url={img2}
                    bounds={new window.google.maps.LatLngBounds(
                        new window.google.maps.LatLng(img2_sw_lat, img2_sw_lng),
                        new window.google.maps.LatLng(img2_ne_lat, img2_ne_lng)
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

