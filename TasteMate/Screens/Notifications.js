import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {NotificationComponent} from "../Components/NotificationComponent";
import styles from "../styles";
import {notifications} from "../MockupData";
import {LogInMessage} from "../Components/LogInMessage";
import {_navigateToScreen} from "../constants/Constants";
import firebase from 'react-native-firebase';

export class NotificationsScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Notifications',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    constructor() {
        super();
        this.unsubscriber = null;
        this.state = {
            user: null
        };
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                // Open SingUpLogIn screen if no account associated (not even anonymous)
                _navigateToScreen('SignUpLogIn', this.props.navigation);
            } else {
                this.setState({user: user});
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _onRefreshPulled() {
        // TODO: pull to refresh
    }

    _keyExtractor = (item, index) => item.notificationid;

    render() {
        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&<FlatList
                        data={notifications}
                        renderItem={({item}) => <NotificationComponent notification={item} {...this.props}/>}
                        refreshing={false}
                        onRefresh={() => this._onRefreshPulled}
                        ListEmptyComponent={() => <Text style={styles.containerPadding}>Seems like you do not have any notifications yet.</Text>}
                        keyExtractor={this._keyExtractor}
                    />
                }
                {
                    !this.state.user || this.state.user.isAnonymous &&
                    <LogInMessage style={{flex:1}}/>
                }
            </View>
        );
    }
}
