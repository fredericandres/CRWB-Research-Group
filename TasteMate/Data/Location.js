export default class Location {
    name;
    googleMapsId;
    address;
    longitude;
    latitude;

    constructor(name, googleMapsId, address, latitude, longitude) {
        this.name = name;
        this.googleMapsId = googleMapsId;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}