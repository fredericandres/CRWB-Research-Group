export default class Location {
    name;
    googleMapsId;
    address;
    longitude;
    latitude;

    constructor(name, googleMapsId, address, longitude, latitude) {
        this.name = name;
        this.googleMapsId = googleMapsId;
        this.address = address;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}