export default class Observation {
    userid;
    observationid;
    dishname;
    mypoc;
    mypoccorrector;
    description;
    location;
    image;
    price;
    currency;
    rating;
    vocabulary;
    timestamp;
    googleMapsId;
    address;
    homemade;

    constructor(userid, observationid, dishname, mypoc, mypoccorrector, location, description, image, price, currency, rating, vocabulary, timestamp, homemade, dietaryRestriction) {
        this.userid = userid;
        this.observationid = observationid;
        this.dishname = dishname;
        this.mypoc = mypoc;
        this.mypoccorrector = mypoccorrector;
        this.description = description;
        this.location = location;
        this.image = image;
        this.price = price;
        // TODO [FEATURE]: Set currency according to location
        this.currency = currency || 'USD';
        this.rating = rating ? rating : 5;
        this.vocabulary = vocabulary ? vocabulary : {};
        this.timestamp = timestamp;
        this.homemade = homemade;
        this.dietaryRestriction = dietaryRestriction || 'none';
    }
}