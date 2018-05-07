import React from "react";
import {ActionSheetIOS, Alert, Image, Text, TouchableOpacity, View, Platform} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {brandContrast} from "./constants/Colors";
import styles from "./styles";
import BottomSheet from 'react-native-bottom-sheet';

export class Observation extends React.Component {
    _onPressLikeButton() {
        Alert.alert('You tapped the button!')
    }

    _onPressCutleryButton() {
        Alert.alert('You tapped the button!')
    }

    _onPressMenuButton() {
        var t = this;
        var title = 'Select an action';
        var message = '';
        var options = [
            'Share',
            'Edit',
            'Delete',
            'Cancel',
        ];
        var cancelButtonIndex = 3;
        var destructiveButtonIndex = 2;

        function _onPressMenuDetailButton(buttonIndex) {
            if (buttonIndex === 1) {
                // TODO: Open Share ActionSheet
            } else if (buttonIndex === 2) {
                // TODO: Open CreateObs screen with pre-filled entries
            } else if (buttonIndex === 3) {
                // TODO: Delete
            }
        }

        // TODO: Customize ActionSheet depending on is logged in or not
        if (Platform.OS === 'android') {
            BottomSheet.showBottomSheetWithOptions({
                    title: title,
                    message: message,
                    options: options,
                    cancelButtonIndex: cancelButtonIndex,
                    destructiveButtonIndex: destructiveButtonIndex,
                },
                (buttonIndex) => {
                    _onPressMenuDetailButton(buttonIndex);
                });

        } else if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({
                    title: title,
                    message: message,
                    options: options,
                    cancelButtonIndex: cancelButtonIndex,
                    destructiveButtonIndex: destructiveButtonIndex,
                },
                (buttonIndex) => {
                    _onPressMenuDetailButton(buttonIndex);
                });
        }
    }

    render() {
        var SmileysEnum = Object.freeze({1:'😖', 2:'😟', 3:'🙁', 4:'😕', 5:'😶', 6:'🙂', 7:'😊', 8:'😄', 9:'😍'});

        return (
            <View name={'wrapper'} style={[styles.containerPadding, styles.baseContainer]}>
                <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                    <View name={'header'} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                        <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={[styles.roundProfile]}/>
                    </View>
                    <View name={'header'} style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}>
                        <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                            <Text name={'dishnames'} >
                                <Text name={'dishname'} style={styles.textTitleBold}>{this.props.item.dishname}</Text>
                                <Text name={'mypoc'} style={styles.textTitle}> ({this.props.item.mypoc})</Text>
                            </Text>
                        </View>
                        <Text name={'location'} style={styles.textSmall}>{this.props.item.location}</Text>
                    </View>
                    <FontAwesome name={'ellipsis-v'} size={25} color={brandContrast} style={styles.containerPadding} onPress={this._onPressMenuButton}/>
                </View>
                <View name={'picture'} style={{backgroundColor:'red', flex: 1, flexDirection:'row'}}>
                    <Image name={'image'} resizeMode={'contain'} source={require('./carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute'}]}>
                        <Text name={'smiley'} style={styles.textStandard}>{SmileysEnum[this.props.item.rating]}</Text>
                    </View>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute', right:0, flexWrap:'wrap'}]}>
                        <Text name={'price'} style={styles.textStandard}>{this.props.item.currency} {this.props.item.price}</Text>
                    </View>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute', bottom: 0, flexDirection:'row'}]}>
                        <TouchableOpacity style={{paddingRight: 6}} onPress={this._onPressLikeButton}>
                            <FontAwesome name={'thumbs-o-up'} size={25} color={brandContrast}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onPressCutleryButton}>
                            <FontAwesome name={'cutlery'} size={25} color={brandContrast}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text>{this.props.item.description}</Text>
                    <Text>{this.props.item.time}</Text>
                    <Text>200k likes</Text>
                    <Text>10k cutleries</Text>
                </View>
                <View>
                    <Image/>
                    <Text>Delicious I bet!</Text>
                    <Image/>
                    <Text>Mmh, so jelly!</Text>
                </View>
            </View>
        );
    }
}

