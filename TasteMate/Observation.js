import React from "react";
import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {brandContrast} from "./constants/Colors";
import styles from "./styles";

export class Observation extends React.Component {
    _onPressLikeButton() {
        Alert.alert('You tapped the button!')
    }

    _onPressCutleryButton() {
        Alert.alert('You tapped the button!')
    }

    render() {
        return (
            <View name={'wrapper'} style={[styles.containerPadding, styles.baseContainer]}>
                <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                    <Image name={'userprofilepic'} size={25} resizeMode={'contain'} source={require('./carbonara.png')} style={[styles.containerPadding, {height: 25, width:25}]}/>
                    <View name={'header'} style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}>
                        <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                            <Text name={'dishname'} style={styles.textTitleBold}>{this.props.item.dishname} ({this.props.item.mypoc})</Text>
                        </View>
                        <Text name={'location'} style={styles.textSmall}>{this.props.item.location}</Text>
                    </View>
                    <FontAwesome name={'ellipsis-v'} size={25} color={brandContrast} style={styles.containerPadding}/>
                </View>
                <View name={'picture'} style={{backgroundColor:'red', flex: 1, flexDirection:'row'}}>
                    <Image name={'image'} resizeMode={'contain'} source={require('./carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute'}]}>
                        <Image name={'smiley'} />
                    </View>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute', right:0, flexWrap:'wrap'}]}>
                        <Text name={'price'}>{this.props.item.currency} {this.props.item.price}</Text>
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

