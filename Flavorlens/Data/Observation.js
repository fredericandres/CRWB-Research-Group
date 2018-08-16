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
    homemade;

    constructor() {
        // TODO [FEATURE]: Set currency according to location
        this.currency = 'USD';
        this.rating = 5;
        this.vocabulary = {};
        this.dietaryRestriction = 'none';
    }
}