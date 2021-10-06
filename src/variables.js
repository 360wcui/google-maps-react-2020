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

export const drone_image_base_lat = 38.98472833
export const drone_image_base_lng = -76.94913167
export const drone_image_increment = 6e-4

export const center = {
    lat: umd_lat,
    lng: umd_lng
};

export const libraries = ["places"]; // for google search
