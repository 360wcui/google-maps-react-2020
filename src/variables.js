import mapStyles from "./mapStyles";

export const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
};
export const options = {
    styles: mapStyles,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeId: "satellite"
};

export const umd_lat = 38.9841278
export const umd_lng = -76.9485321

export const center = {
    lat: umd_lat,
    lng: umd_lng
};

export const libraries = ["places"]; // for google search
