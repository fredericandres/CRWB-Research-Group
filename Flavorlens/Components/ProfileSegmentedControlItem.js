import React from "react";
import styles from "../styles";
import {Text, TouchableOpacity} from "react-native";
import strings from "../strings";

export class ProfileSegmentedControlItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={this.props.action} style={[styles.segmentedControl, this.props.isSelected ? styles.itemSelected : styles.itemNotSelected, this.props.text===strings.photos ? styles.leftRoundedEdges : (this.props.text===strings.following ? styles.rightRoundedEdges : {})]}>
                <Text name={'title'} style={[styles.textStandard, {textAlign:'center'}, this.props.isSelected ? styles.textSelected : styles.textNotSelected]}>
                    {this.props.text}
                </Text>
                <Text name={'number'} style={[styles.textLargeBold, {textAlign:'center'}, this.props.isSelected ? styles.textSelected : styles.textNotSelected]}>
                    {this.props.number}
                </Text>
            </TouchableOpacity>
        );
    }
}