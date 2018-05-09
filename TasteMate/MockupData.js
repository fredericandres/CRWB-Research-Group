export const observations = [
    {key: '12343', value: { userid:213, dishname :'A  reall very long title will it fit what will the layout dor', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:6, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', timestamp:1525842681630, likes:'200k', cutleries:'5k'}},
    {key: '1234', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut',location: 'National Institute of Informatics', googleMapsId: 'ChIJ93oq5RGMGGARDvEMb6UBvlk', rating:5, imageid:'asd', price: '34.25', currency:'EUR', description:'Donut come for me if you want trouble...', timestamp:1525842681630, likes:'1', cutleries:'0'}},
    {key: '12342', value: { userid:213, dishname :'Carbonarinis', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:1, imageid:'asd', price: '2,000', currency:'YEN', description:'Donut come for me if you want trouble...', timestamp:1525842681130, likes:'123m', cutleries:'2m'}},
    {key: '12344', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:2, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', timestamp:1525842641630, likes:'3k', cutleries:'607'}},
    {key: '12345', value: { userid:213, dishname :'Madam with the longest title ever imaginable but it is a very important dish so it totally makes sense ya know it is more than four lines long wow', mypoc:'Donut', location: 'Yoshinoya', googleMapsId: 'ChIJcfDfiROMGGARlXN3FRTivo8', rating:9, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', timestamp:1525832681630, likes:'110', cutleries:'7'}},
];

export const adjectives = [
    {key:'0', value: {adjective:'cinnamon'}},
    {key:'1', value: {adjective:'ginger'}},
    {key:'2', value: {adjective:'acidulated'}},
    {key:'3', value: {adjective:'zesty'}},
    {key:'4', value: {adjective:'crunchy'}},
    {key:'5', value: {adjective:'tasty'}},
    {key:'6', value: {adjective:'lemon'}},
    {key:'7', value: {adjective:'sweet'}},
];

export const comments = [
    {key: '1', value:{userid:123, imageid:'123', message:'Delicious I bet!'}},
    {key: '2', value:{userid:123, imageid:'123', message:'Mmh, so jelly! Hehe remember the last time we had that together? We were both maybe 10 years old and laughing so hard at everything.. lol!! Good times'}},
    {key: '3', value:{userid:123, imageid:'123', message:'Oh my goodness, that truly looks amazing! I wish I was there eating this with you! xoxo'}},
]

export const notifications = [
    {key:'0', value: {senderid:'julianthegreatestman', type:'LIKE', observationid:'12343', timestamp:(new Date()).valueOf(), read:false}},
    {key:'1', value: {senderid:'annabanana', type:'WANTTOEAT', observationid:'1234', timestamp:1525842681630, read:false}},
    {key:'2', value: {senderid:'123jump', type:'FOLLOW', timestamp:1525842681230, read:false}},
    {key:'3', value: {senderid:'watatat', type:'SHARE', observationid:'12345', timestamp:1525842671630, read:false}},
    {key:'4', value: {senderid:'nyum', type:'LIKE', observationid:'12344', timestamp:1525832681630, read:true}},
    {key:'5', value: {senderid:'shelby', type:'SHARE', observationid:'1234', timestamp:1522842581630, read:true}},
    {key:'6', value: {senderid:'missy', type:'LIKE', observationid:'1234', timestamp:1515841681630, read:true}},
    {key:'7', value: {senderid:'ardnaxela', type:'FOLLOW', timestamp:1425832681630, read:true}},
];