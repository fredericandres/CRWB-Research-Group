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
        // TODO: pull to refresh

        return (
            <FlatList
                      data={[
                          {key: '12343', value: { userid:213, dishname :'A  reall very long title will it fit what will the layout dor', mypoc:'Donut', location:'Donuteria', rating:6, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'2 days ago', likes:'200k', cutleries:'5k'}},
                          {key: '1234', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location:'Donuteria', rating:5, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'3 days ago', likes:'1', cutleries:'0'}},
                          {key: '12342', value: { userid:213, dishname :'Carbonarinis', mypoc:'Donut', location:'Donuteria', rating:1, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'4 days ago', likes:'123m', cutleries:'2m'}},
                          {key: '12344', value: { userid:213, dishname :'Mr Frosty', mypoc:'Donut', location:'Donuteria', rating:2, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'10 days ago', likes:'3k', cutleries:'607'}},
                          {key: '12345', value: { userid:213, dishname :'Madam with the longest title ever imaginable but it is a very important dish so it totally makes sense ya know it is more than four lines long wow', mypoc:'Donut', location:'Donuteria', rating:9, imageid:'asd', price: '3.99', currency:'USD', description:'Donut come for me if you want trouble...', time:'32 days ago', likes:'110', cutleries:'7'}},
                      ]}
                      renderItem={({item}) => <Observation item={item.value} nav={this.props.navigation}/>}
            />
        );
    }
}

//<--Button
//                     title="Go to ObsDetail"
//                     onPress={() => this.props.navigation.navigate('ObservationDetail')}
//                 /!-->
//                 <View>