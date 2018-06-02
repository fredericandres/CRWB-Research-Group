import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {_navigateToScreen, brandContrast, iconSizeStandard} from "../constants/Constants";
import StandardStyle from "../styles";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import strings from "../strings";
import firebase from 'react-native-firebase';

export class NavBarButton extends React.Component {
    _openScreen(screen) {
        _navigateToScreen(screen, this.props.nav, null, true);
    }

    render() {
        const screen = this.props.screen;
        const icon = this.props.icon;
        const image = this.props.image;
        const text = this.props.text;
        const iconType = this.props.iconType;
        const action = this.props.actionn || (() => this._openScreen(screen));

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
            // TODO: only go to my profile if logged in, else go to signup/login
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

export class NavBarFollowUnfollowButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const actionn = this.props.actionn;
        return (
            <NavBarButton icon={'user-following'} iconType={'SimpleLineIcons'} actionn={actionn}/>
        );
    }
}