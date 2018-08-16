import React from 'react';
import {ObservationComponent} from "../Components/ObservationComponent";
import {Animated, Keyboard, Platform, ScrollView, View} from "react-native";
import strings from "../strings";
import RNSafeAreaGetter from "../SafeAreaGetter";
import {ReactNavigationTabBarHeight} from "../Constants/Constants";

export class ObservationDetailScreen extends React.Component {
    static navigationOptions = {
        title: strings.observationDetail + ' ',
    };

    constructor(props) {
        super(props);

        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

        this.state = {
            keyboardHeight: 0,
        };
        this.keyboardHeight = new Animated.Value(0);
        this.scrollView = null;
        this.scrollToBottom = false;

        const parent = this.props.navigation.dangerouslyGetParent();
        this.myProfile = parent && parent.state && parent.state.key && parent.state.key !== 'Explore';
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
    }

    componentWillUnmount() {
        if (this.keyboardDidShowListener) {
            this.keyboardDidShowListener.remove();
        }
        if (this.keyboardDidHideListener) {
            this.keyboardDidHideListener.remove();
        }
    }

    _keyboardDidShow(e) {
        RNSafeAreaGetter.getBottomPadding((error, bottomPadding) => {
            if (error) {
                console.log(error);
            } else {
                const keyboardHeight = e.endCoordinates.height - (this.myProfile ? 0 : (bottomPadding + ReactNavigationTabBarHeight));
                this.scrollToBottom = true;
                this.setState({ keyboardHeight: keyboardHeight});
            }
        });
    }

    _keyboardDidHide() {
        this.setState({keyboardHeight: 0});
    }

    onLayout() {
        if (this.scrollToBottom) {
            this.scrollView.scrollToEnd({animated: true});
            this.scrollToBottom = false;
        }
    }

    render() {
        return (
            <ScrollView ref={scrollView => this.scrollView = scrollView} >
                <ObservationComponent {...this.props} observation={this.props.navigation.getParam('observation', null)}/>
                <View onLayout={this.onLayout.bind(this)} style={{height: this.state.keyboardHeight} }/>
            </ScrollView>
        );
    }
}

