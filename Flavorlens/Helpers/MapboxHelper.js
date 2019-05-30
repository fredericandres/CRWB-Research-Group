import { mapboxApiKey } from "../Constants/ApiKeys";

// List of mapbox apis is here https://docs.mapbox.com/api/

const baseApiUrl = 'https://api.mapbox.com/';

const services = {
    maps: '', // TODO add other services as needed
    search: {
        geocoding: 'geocoding/'
    }
};

const versions = {
    v5: 'v5/'
}

const currentVersion = versions.v5;

const endpoints = {
    places: 'mapbox.places/',
    placesPermanent: 'mapbox.places-permanent/'
}

const urls = {
    geocoding: baseApiUrl + services.search.geocoding + currentVersion + endpoints.places
}

export const geocoder = {
    forward: (searchText) =>
        fetch(urls.geocoding + searchText + '.json?access_token=' + mapboxApiKey)
        .then((response) => response.json())
        .then((responseJson) => responseJson)
        .catch(console.error),
    reverse: (lat, long) =>
        fetch(urls.geocoding + long + ',' + lat + '.json')
        .then((response) => response.json())
        .then((responseJson) => responseJson)
        .catch(console.error),
}
