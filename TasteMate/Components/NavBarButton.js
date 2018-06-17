import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {_navigateToScreen, brandContrast, iconSizeStandard} from "../constants/Constants";
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
        // User is only logged in if he is NOT anonymous
        const isLoggedIn = this.props.isLoggedIn === undefined ? true : this.props.isLoggedIn;
        const screen = this.props.screen;
        const icon = this.props.icon;
        const image = this.props.image;
        const text = this.props.text;
        const iconType = this.props.iconType;
        const onDataChangedAction = this.props.onDataChangedAction;
        const action = this.props.action || (() => this._openScreen(screen, onDataChangedAction));

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
        return (
            <NavBarButton icon={'user-o'} {...this.props}/>
        );
    }
}

export class NavBarCreateObsButton extends React.Component {
    render() {
        return (
            <NavBarButton icon={'plus'} {...this.props}/>
        );
    }
}

export class NavBarCloseButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} text={strings.close} action={() => nav.goBack(null)}/>
        );
    }
}

export class NavBarLogoutButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} icon={'sign-out'} action={() => {firebase.auth().signOut(); nav.dismiss();}}/>
        );
    }
}

export class NavBarFollowUnFollowButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const action = this.props.action;
        return (
            <NavBarButton icon={this.props.icon} iconType={'SimpleLineIcons'} action={action}/>
        );
    }
}