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
            <TouchableOpacity activeOpacity={0.9} onPress={this.props.action} style={[styles.segmentedControl, styles.containerPadding, this.props.isSelected ? styles.itemSelected : styles.itemNotSelected, (this.props.text===strings.map ? styles.rightRoundedEdges : styles.leftRoundedEdges)]}>
                <Text name={'title'} style={[styles.textTitleBold, {textAlign:'center'}, this.props.isSelected ? styles.textSelected : styles.textNotSelected]}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        );
    }
}