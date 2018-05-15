import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {_navigateToScreen, brandContrast, iconSizeStandard} from "../constants/Constants";
import StandardStyle from "../styles";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import strings from "../strings";

export class NavBarButton extends React.Component {
    _openScreen(screen) {
        _navigateToScreen(screen, this.props.nav, null, true);
    }

    render() {
        const nav = this.props.nav;
        const screen = this.props.screen;
        const icon = this.props.icon;
        const image = this.props.image;
        const text = this.props.text;
        const isModal = this.props.isModal;
        const iconType = this.props.iconType;
        const action = this.props.actionn;

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

        // Action
        let wrapper = <TouchableOpacity/>;
        if (isModal) {
            wrapper =
                <TouchableOpacity onPress={() => nav.goBack(null)} style={StandardStyle.containerPadding}>
                    {content}
                </TouchableOpacity>
        } else {
            wrapper =
                <TouchableOpacity onPress={screen === undefined ? action : (()=> this._openScreen(screen))} style={StandardStyle.containerPadding}>
                    {content}
                </TouchableOpacity>;
        }

        return (
            wrapper
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
            <NavBarButton nav={nav} screen={'CreateObservation'} icon={'plus'} />
        );
    }
}

export class NavBarCloseButton extends React.Component {
    render() {
        const nav = this.props.nav;
        return (
            <NavBarButton nav={nav} text={strings.close} isModal={true} />
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