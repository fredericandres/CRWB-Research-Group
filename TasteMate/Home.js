import React from 'react';
import {FlatList} from 'react-native';
import styles from "./styles";
import {NavBarCreateObsButton, NavBarProfileButton} from "./NavBarButton";
import {Observation} from "./Observation";

export class HomeScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Tastemate',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

render() {
    return (
        <FlatList style={styles.baseContainer}
                  data={[
                      {key: '12343', value: { userid:213, dishname :'A  reall very long title will it fit what will the layout dor', mypoc:'Donut', location:'Donuteria', rating:6, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago'}},
                      {key: '1234', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location:'Donuteria', rating:5, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago'}},
                      {key: '12342', value: { userid:213, dishname :'Carbonarinis', mypoc:'Donut', location:'Donuteria', rating:1, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago'}},
                      {key: '12344', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location:'Donuteria', rating:2, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago'}},
                      {key: '12345', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location:'Donuteria', rating:9, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago'}},
                  ]}
                  renderItem={({item}) => <Observation item={item.value}/>}
        />
    );
}
}

//<--Button
//                     title="Go to ObsDetail"
//                     onPress={() => this.props.navigation.navigate('ObservationDetail')}
//                 /!-->
//                 <View>