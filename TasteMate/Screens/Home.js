import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {ObservationComponent} from "../Components/ObservationComponent";
import styles from "../styles";
import {observations} from "../MockupData";
import strings from "../strings";
import firebase from 'react-native-firebase';
import {_navigateToScreen} from "../constants/Constants";
import {LogInMessage} from "../Components/LogInMessage";

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

    _keyExtractor = (item, index) => item.observationid;

    render() {
        return (
            <View style={{flex:1}}>
                {
                    this.state.user && !this.state.user.isAnonymous &&
                    <FlatList
                        data={observations}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => <ObservationComponent observation={item} {...this.props}/>}
                        refreshing={false}
                        onRefresh={() => this._onRefreshPulled}
                        ListEmptyComponent={() => <Text style={[styles.containerPadding, styles.textStandardDark]}>{strings.emptyFeed}</Text>}
                        ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}
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
// TODO [FEATURE]: empty list component with suggestions for followees/observations
