import Observation from "./Data/Observation";
import Location from "./Data/Location";

const location1 = new Location('Yoshinoya', 'ChIJcfDfiROMGGARlXN3FRTivo8', 'Japan, 〒101-0051 Tōkyō-to, Chiyoda-ku, Kanda Jinbōchō, 2 Chome−７−７', 35.695688, 139.755246);
const location2 = new Location('Voodoo Doughnut', 'ChIJ81ogcae1RIYRPNSTL-oW9IY', '212 E 6th St, Austin, TX 78701, USA', 30.2676502, -97.7430909);

const obs1 = new Observation('asdasdasd', 'O1', 'Mr Frosty', 'Donut', '', location1, 'Mmm this is so delicious seriously', '', '3.99', 'EUR', 9, {1:true, 3:true}, 1525842671630);
const obs2 = new Observation('dzt47KWDHrR0ysFdCccdYvctUOb2', 'O2', 'Mr Frosty', 'Donut', '', location2, 'Mmm this is so delicious seriously', '', '3.99', 'EUR', 9, {1:true, 3:true}, 1525842671630);

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
    {key: 'C1', value:{userid:'U1', imageid:'123', message:'Delicious I bet!'}},
    {key: 'C2', value:{userid:'U2', imageid:'123', message:'Mmh, so jelly! Hehe remember the last time we had that together? We were both maybe 10 years old and laughing so hard at everything.. lol!! Good times'}},
    {key: 'C3', value:{userid:'U3', imageid:'123', message:'Oh my goodness, that truly looks amazing! I wish I was there eating this with you! xoxo'}},
];

let lotsOfUsers = [];
for (let i = 0; i < 10001; i++){
    lotsOfUsers[i] = 'asd';
}

export const notifications = [
    {notificationid:'N0', senderid:['julianthegreatestman'], type:'LIKE', observationid:'12343', timestamp:(new Date()).valueOf(), read:false},
    {notificationid:'N1', senderid:['annabanana'], type:'WANTTOEAT', observationid:'1234', timestamp:1525842681630, read:false},
    {notificationid:'N2', senderid:['123jump'], type:'FOLLOW', timestamp:1525842681230, read:false},
    {notificationid:'N3', senderid:['watatat'], type:'SHARE', observationid:'12345', timestamp:1525842671630, read:false},
    {notificationid:'N4', senderid:lotsOfUsers, type:'LIKE', observationid:'12344', timestamp:1525832681630, read:true},
    {notificationid:'N5', senderid:['shelby', 'missy', 'nyum', 'watatat'], type:'SHARE', observationid:'1234', timestamp:1522842581630, read:true},
    {notificationid:'N6', senderid:['missyuserwithasuperduperlongusernamewowthisissolongimnotsureifthesystemshouldallowthislength'], type:'LIKE', observationid:'1234', timestamp:1515841681630, read:true},
    {notificationid:'N7', senderid:['ardnaxela', 'luisa'], type:'FOLLOW', timestamp:1425832681630, read:true},
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
    {userid: 'U1', username:'annabanana', location: 'Munich, Germany', isFollowing:true},
    {userid: 'U2', username:'julianthegreatestman', location: 'Stockholm, Sweden', isFollowing:false},
    {userid: 'U3', username:'123jump', location: 'Tokyo, Japan', isFollowing:false},
    {userid: 'U4', username:'watatat', location: 'Oslo, Norway', isFollowing:false},
    {userid: 'U5', username:'shelby', location: 'Denver, Colorado, USA', isFollowing:true},
    {userid: 'U6', username:'missyuserwithasuperduperlongusernamewowthisissolongimnotsureifthesystemshouldallowthislength', location: 'Melbourne, Australia', isFollowing:true},
    {userid: 'U7', username:'luisa', location: 'Stockholm, Sweden', isFollowing:true},
    {userid: 'U8', username:'ardnaxela', location: 'Stockholm, Sweden', isFollowing:true},
];

export const eatingOutObservations = [
    {id:'E0', location:'Los Angeles, CA, USA'},
    {id:'E1', location:'Munich, Germany'},
    {id:'E2', location:'Los Angeles, CA, USA'},
    {id:'E3', location:'Los Angeles, CA, USA'},
];
