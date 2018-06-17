import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {_navigateToScreen, brandContrast, iconSizeStandard} from "../constants/Constants";
import {currentUser} from "../App";
import StandardStyle from "../styles";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import strings from "../strings";
import firebase from 'react-native-firebase';

export class NavBarButton extends React.Component {
    _openScreen(screen, onDataChangedAction) {
        let params = {};
        params.myProfile = true;
        if (onDataChangedAction) {
            params.onDataChangedAction = onDataChangedAction;
        }
        _navigateToScreen(screen, this.props.nav, params);
    }

    render() {
        // TODO: Fix bug where logged out -> login -> click on top buttons -> should be profile but is signup
        // User is only logged in if he is NOT anonymous
        const isLoggedIn = currentUser ? !currentUser.isAnonymous : false;
        const screen = this.props.screen;
        const icon = this.props.icon;
        const image = this.props.image;
        const text = this.props.text;
        const iconType = this.props.iconType;
        const onDataChangedAction = this.props.onDataChangedAction;
        const action = this.props.actionn || (isLoggedIn ? (() => this._openScreen(screen, onDataChangedAction)): () => this._openScreen('SignUpLogIn'));

        // Content
        let content = <Text>{text}</Text>;
        if (icon != null) {
            if (iconType === 'SimpleLineIcons') {
                content = <SimpleLineIcons name={icon} size={iconSizeStandard} color={brandContrast}/>;
            } else {
                content = <FontAwesome name={icon} size={iconSizeStandard} color={brandContrast}/>;
            }
        } else if (image != null) {
            content = <Image/>;
        }

        return (
            <TouchableOpacity onPress={action} style={StandardStyle.containerPadding}>
                {content}
            </TouchableOpacity>
        );
    }
}

export class NavBarProfileButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} screen={'MyProfile'} icon={'user-o'}/>
        );
    }
}

export class NavBarCreateObsButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} screen={'CreateObservation'} icon={'plus'}/>
        );
    }
}

export class NavBarCloseButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} text={strings.close} actionn={() => nav.goBack(null)}/>
        );
    }
}

export class NavBarLogoutButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} icon={'sign-out'} actionn={() => {firebase.auth().signOut(); nav.dismiss();}}/>
        );
    }
}

export class NavBarFollowUnFollowButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const actionn = this.props.actionn;
        return (
            <NavBarButton icon={this.props.icon} iconType={'SimpleLineIcons'} actionn={actionn}/>
        );
    }
}