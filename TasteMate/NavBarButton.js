import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {brandContrast} from "./constants/Colors";
import StandardStyle from "./StandardStyle";

export class NavBarButton extends React.Component {
    render() {
        var nav = this.props.nav;
        var screen = this.props.screen;
        var icon = this.props.icon;
        var image = this.props.image;
        var text = this.props.text;
        var isModal = this.props.isModal;

        // Content
        var content = <Text>{text}</Text>;
        if (icon != null) {
            content =  <FontAwesome name={icon} size={25} color={brandContrast}/>;
        } else if (image != null) {
            content = <Image/>;
        }

        //Action
        var wrapper = <TouchableOpacity/>;
        if (isModal) {
            wrapper =
                <TouchableOpacity onPress={() => nav.goBack(null)} style={StandardStyle.container}>
                    {content}
                </TouchableOpacity>
        } else {
            wrapper =
                <TouchableOpacity onPress={() => nav.navigate(screen)} style={StandardStyle.container}>
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
        var nav = this.props.nav;
        return (
            <NavBarButton nav={nav} screen={'Profile'} icon={'user'} />
        );
    }
}

export class NavBarCreateObsButton extends React.Component {
    render() {
        var nav = this.props.nav;
        return (
            <NavBarButton nav={nav} screen={'CreateObservation'} icon={'plus'} />
        );
    }
}

export class NavBarCloseButton extends React.Component {
    render() {
        var nav = this.props.nav;
        return (
            <NavBarButton nav={nav} text={'Close'} isModal={true} />
        );
    }
}