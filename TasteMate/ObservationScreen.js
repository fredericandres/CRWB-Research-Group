import React from "react";
import {ActionSheetIOS, Alert, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View, Linking} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {brandContrast, brandLight, brandMain} from "./constants/Colors";
import styles from "./styles";
import BottomSheet from 'react-native-bottom-sheet';

export class ObservationScreen extends React.Component {
    constructor(props) {
        super(props);
        this._onPressMenuButton = this._onPressMenuButton.bind(this);
        this._onPressMenuDetailButton = this._onPressMenuDetailButton.bind(this);
        this._onPressLocationText = this._onPressLocationText.bind(this);
    }

    _onPressLikeButton() {
        // TODO: Like action
    }

    _onPressCutleryButton() {
        // TODO: Cutlery action
    }

    _onPressSendButton() {
        // TODO: Send action
    }

    _onPressLocationText() {
        // TODO: Possible maps integration, e.g. using https://github.com/react-community/react-native-maps
        var url =  'https://www.google.com/maps/search/?api=1&query=' + this.props.item.location + '&query_place_id=' + this.props.item.googleMapsId;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    _onPressMenuButton() {
        var title = 'Select an action';
        var message = 'What would you like to do with the post \"' + this.props.item.dishname + '\" by ' + this.props.item.userid;
        var options = [
            'Share',
            'Edit',
            'Delete',
            'Cancel',
        ];
        var cancelButtonIndex = 3;
        var destructiveButtonIndex = 2;

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
                    this._onPressMenuDetailButton(buttonIndex);
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
                    this._onPressMenuDetailButton(buttonIndex);
                });
        }
    }

    _onPressMenuDetailButton(buttonIndex) {
        if (buttonIndex === 0) {
            // TODO: Whati s being shared? Link?
            var subject = 'Share';
            var message = 'Where do you want to share this post?';
            var url = '';
            //var excludedActivityTypes = '';

            if (Platform.OS === 'android') {
                BottomSheet.showShareBottomSheetWithOptions({
                        subject: subject,
                        message: message,
                        url: url,
                    },
                    () => {
                        this._onSuccessfulShare();
                    },
                    () => {
                        this._onUnsuccessfulShare();
                    });
            } else if (Platform.OS === 'ios') {
                ActionSheetIOS.showShareActionSheetWithOptions({
                        subject: subject,
                        message: message,
                        url: url,
                    },
                    () => {
                        this._onSuccessfulShare();
                    },
                    () => {
                        this._onUnsuccessfulShare();
                    });
            }
        } else if (buttonIndex === 1) {
            this.props.nav.navigate('CreateObservation', {item: this.props.item});
        } else if (buttonIndex === 2) {
            // TODO: Delete obs
        }
    }

    _onSuccessfulShare(buttonIndex) {
        // TODO: ??
    }

    _onUnsuccessfulShare(buttonIndex) {
        // TODO: ??
    }

    render() {
        var SmileysEnum = Object.freeze({1:'😖', 2:'😟', 3:'🙁', 4:'😕', 5:'😶', 6:'🙂', 7:'😊', 8:'😄', 9:'😍'});

        return (
            <View >
                <View name={'wrapper'} >
                    <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                        <View name={'header'} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                            <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={styles.roundProfile}/>
                        </View>
                        <View name={'header'} style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}>
                            <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                                <Text name={'dishnames'} >
                                    <Text name={'dishname'} style={styles.textTitleBold}>{this.props.item.dishname}</Text>
                                    <Text name={'mypoc'} style={styles.textTitle}> ({this.props.item.mypoc})</Text>
                                </Text>
                            </View>
                            <Text name={'location'} style={styles.textSmall} onPress={this._onPressLocationText}>{this.props.item.location}</Text>
                        </View>
                        <FontAwesome name={'ellipsis-v'} size={25} color={brandContrast} style={styles.containerPadding} onPress={this._onPressMenuButton}/>
                    </View>
                    <View name={'picture'} style={{flex: 1, flexDirection:'row'}}>
                        <Image name={'image'} resizeMode={'contain'} source={require('./carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
                        <View style={[styles.containerOpacity, {padding: 6, position: 'absolute'}]}>
                            <Text name={'smiley'} style={styles.textTitleBold}>{SmileysEnum[this.props.item.rating]}</Text>
                        </View>
                        <View style={[styles.containerOpacity, {padding: 6, position: 'absolute', right:0, flexWrap:'wrap'}]}>
                            <Text name={'price'} style={styles.textTitleBold}>{this.props.item.currency} {this.props.item.price}</Text>
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
                    <View name={'description'} style={[styles.containerPadding, styles.bottomLine, {flex: 1, flexDirection:'column'}]}>
                        <Text name={'description'} style={styles.textStandard}>{this.props.item.description}</Text>
                        {/*TODO: reformat time, likes & cutleries from e.g. 2001 likes to 2k likes, date to 2 days ago etc*/}
                        <Text name={'details'} style={styles.textSmall}>{this.props.item.time} • {this.props.item.likes} likes • {this.props.item.cutleries} cutleries</Text>
                    </View>
                    <FlatList name={'comments'} style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}
                              data={[
                                  {key: '1', value:{userid:123, imageid:'123', message:'Delicious I bet!'}},
                                  {key: '2', value:{userid:123, imageid:'123', message:'Mmh, so jelly! Hehe remember the last time we had that together? We were both maybe 10 years old and laughing so hard at everything.. lol!! Good times'}},
                                  {key: '3', value:{userid:123, imageid:'123', message:'Oh my goodness, that truly looks amazing! I wish I was there eating this with you! xoxo'}},
                              ]}
                              renderItem={({item}) =>
                                  <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                                      <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={require('./user.jpg')} />
                                      <Text style={[styles.textStandard, styles.containerPadding, {flex: 1}]}>{item.value.message}</Text>
                                  </View>}
                              ListFooterComponent={() =>
                                  <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                                      <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={require('./user2.jpg')} />
                                      <TextInput style={[styles.textStandard, styles.containerPadding, {flex: 1}]} placeholder="Write a comment..." placeholderTextColor={brandLight} returnKeyType={'send'} keyboardType={'default'} underlineColorAndroid={brandContrast} selectionColor={brandMain} onSubmitEditing={this._onPressSendButton}/>
                                      <TouchableOpacity onPress={this._onPressSendButton}>
                                          <FontAwesome name={'send'} size={25} color={brandContrast}/>
                                      </TouchableOpacity>
                                  </View>
                              }
                    />
                </View>
                <View style={styles.containerPadding}/>
            </View>

        );
    }
}

//TODO: keyboard reopens when alert dismissed, 3+ comments