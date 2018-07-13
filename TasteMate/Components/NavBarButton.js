import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {_navigateToScreen, brandContrast, iconNew, iconSignOut, iconSizeNavBar, iconUser} from "../constants/Constants";
import styles from "../styles";
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
        const screen = this.props.screen;
        const icon = this.props.icon;
        const image = this.props.image;
        const text = this.props.text;
        const iconType = this.props.iconType;
        const onDataChangedAction = this.props.onDataChangedAction;
        const action = this.props.action || (() => this._openScreen(screen, onDataChangedAction));

        // Content
        let content = <Text style={[styles.textTitle, styles.containerPadding, {color: brandContrast}]}>{text}</Text>;
        if (icon != null) {
            if (iconType === 'SimpleLineIcons') {
                content = <SimpleLineIcons name={icon} size={iconSizeNavBar} color={brandContrast} style={styles.containerPadding}/>;
            } else {
                content = <FontAwesome name={icon} size={iconSizeNavBar} color={brandContrast} style={styles.containerPadding}/>;
            }
        } else if (image != null) {
            content = <Image/>;
        }

        return (
            <TouchableOpacity onPress={action} style={styles.containerPadding}>
                {content}
            </TouchableOpacity>
        );
    }
}

export class NavBarProfileButton extends React.Component {
    render() {
        return (
            <NavBarButton icon={iconUser} {...this.props}/>
        );
    }
}

export class NavBarCreateObsButton extends React.Component {
    render() {
        return (
            <NavBarButton icon={iconNew} {...this.props}/>
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
            <NavBarButton nav={nav} icon={iconSignOut} action={() => {nav.dismiss(); firebase.auth().signOut();}}/>
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