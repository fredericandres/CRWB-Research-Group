import React from 'react';
import styles from '../styles';
import {ActivityIndicator, Text, View} from 'react-native';
import {colorBackground} from '../Constants/Constants';

export class ActivityIndicatorComponent extends React.Component {
    render() {
        return (
            <View name={'activityindicator'} style={[styles.containerOpacityDark, {alignItems:'center', flexDirection:'row', justifyContent:'center', position:'absolute', top:0, right:0, left:0, bottom:0}]}>
                <View style={{flex: 1}}/>
                <View style={{flex: 6, alignItems: 'center'}}>
                    <ActivityIndicator size={'large'} style={styles.containerPadding} color={colorBackground} animating={this.props.visible}/>
                    <Text style={[styles.containerPadding, styles.textStandardLight, {textAlign:'center'}]}>{this.props.text}</Text>
                </View>
                <View style={{flex: 1}}/>
            </View>
        );
    }
}