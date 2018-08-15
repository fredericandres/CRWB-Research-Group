import React from 'react';
import styles from "../styles";
import {FlatList, View} from "react-native";
import {UserComponent} from "../Components/UserComponent";

export class UsersScreen extends React.Component {
    static navigationOptions = {
        title: ' ',
    };

    constructor(props) {
        super(props);
        this.state = {
            users: props.navigation.getParam('users'),
            allUsers: props.navigation.getParam('allUsers')
        };
    }

    _keyExtractor = (item) => item;

    render() {
        return (
            <View style={{flex:1}}>
                <FlatList
                    style={styles.containerPadding}
                    data={this.state.users}
                    ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
                    renderItem={({item}) => <UserComponent user={this.state.allUsers[item]} {...this.props}/>}
                    keyExtractor={this._keyExtractor}
                />
            </View>

        );
    }
}
