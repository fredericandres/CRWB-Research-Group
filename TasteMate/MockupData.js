import Observation from "./Data/Observation";
import Location from "./Data/Location";

const location1 = new Location('Yoshinoya', 'ChIJcfDfiROMGGARlXN3FRTivo8', 'Japan, 〒101-0051 Tōkyō-to, Chiyoda-ku, Kanda Jinbōchō, 2 Chome−７−７',  139.755246, 35.695688,);
const location2 = new Location('Voodoo Doughnut', 'ChIJ81ogcae1RIYRPNSTL-oW9IY', '212 E 6th St, Austin, TX 78701, USA', 30.2676502, -97.7430909);

const obs1 = new Observation('U1', 'O1', 'Mr Frosty', 'Donut', '', location1, 'Mmm this is so delicious seriously', '', '3.99', 'EUR', 9, {1:true, 3:true}, 1525842671630);
const obs2 = new Observation('U1', 'O2', 'Mr Frosty', 'Donut', '', location2, 'Mmm this is so delicious seriously', '', '3.99', 'EUR', 9, {1:true, 3:true}, 1525842671630);

export const observations = [
    obs1, obs2
];

export const adjectives = [
    {key:'A0', value: {adjective:'cinnamon'}},
    {key:'A1', value: {adjective:'ginger'}},
    {key:'A2', value: {adjective:'acidulated'}},
    {key:'A3', value: {adjective:'zesty'}},
    {key:'A4', value: {adjective:'crunchy'}},
    {key:'A5', value: {adjective:'tasty'}},
    {key:'A6', value: {adjective:'lemon'}},
    {key:'A7', value: {adjective:'sweet'}},
];

export const comments = [
    {key: 'C1', value:{userid:123, imageid:'123', message:'Delicious I bet!'}},
    {key: 'C2', value:{userid:123, imageid:'123', message:'Mmh, so jelly! Hehe remember the last time we had that together? We were both maybe 10 years old and laughing so hard at everything.. lol!! Good times'}},
    {key: 'C3', value:{userid:123, imageid:'123', message:'Oh my goodness, that truly looks amazing! I wish I was there eating this with you! xoxo'}},
];

let lotsOfUsers = [];
for (let i = 0; i < 10001; i++){
    lotsOfUsers[i] = 'asd';
}

export const notifications = [
    {key:'N0', value: {senderid:['julianthegreatestman'], type:'LIKE', observationid:'12343', timestamp:(new Date()).valueOf(), read:false}},
    {key:'N1', value: {senderid:['annabanana'], type:'WANTTOEAT', observationid:'1234', timestamp:1525842681630, read:false}},
    {key:'N2', value: {senderid:['123jump'], type:'FOLLOW', timestamp:1525842681230, read:false}},
    {key:'N3', value: {senderid:['watatat'], type:'SHARE', observationid:'12345', timestamp:1525842671630, read:false}},
    {key:'N4', value: {senderid:lotsOfUsers, type:'LIKE', observationid:'12344', timestamp:1525832681630, read:true}},
    {key:'N5', value: {senderid:['shelby', 'missy', 'nyum', 'watatat'], type:'SHARE', observationid:'1234', timestamp:1522842581630, read:true}},
    {key:'N6', value: {senderid:['missyuserwithasuperduperlongusernamewowthisissolongimnotsureifthesystemshouldallowthislength'], type:'LIKE', observationid:'1234', timestamp:1515841681630, read:true}},
    {key:'N7', value: {senderid:['ardnaxela', 'luisa'], type:'FOLLOW', timestamp:1425832681630, read:true}},
];

export const userr = {
    userid: 'U123',
    email: 'a@b.de',
    password: 'asdasd',
    username: 'isnotyourname',
    location: 'Mumbai, India',
    joined: 1425832681630,
    picture: 'asdasd',
    isFollowing:true
};

export const users = [
    {key:'U0', value: {username:'annabanana', location: 'Munich, Germany', isFollowing:true}},
    {key:'U1', value: {username:'julianthegreatestman', location: 'Stockholm, Sweden', isFollowing:false}},
    {key:'U2', value: {username:'123jump', location: 'Tokyo, Japan', isFollowing:false}},
    {key:'U3', value: {username:'watatat', location: 'Oslo, Norway', isFollowing:false}},
    {key:'U4', value: {username:'shelby', location: 'Denver, Colorado, USA', isFollowing:true}},
    {key:'U5', value: {username:'missyuserwithasuperduperlongusernamewowthisissolongimnotsureifthesystemshouldallowthislength', location: 'Melbourne, Australia', isFollowing:true}},
    {key:'U6', value: {username:'luisa', location: 'Stockholm, Sweden', isFollowing:true}},
    {key:'U7', value: {username:'ardnaxela', location: 'Stockholm, Sweden', isFollowing:true}},
];

export const eatingOutObservations = [
    {key:'E0', value: {location:'Los Angeles, CA, USA'}},
    {key:'E1', value: {location:'Munich, Germany'}},
    {key:'E2', value: {location:'Los Angeles, CA, USA'}},
    {key:'E3', value: {location:'Los Angeles, CA, USA'}},
];
