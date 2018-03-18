import React from "react";
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

export class ReceivedMessageBlock extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.from}>From {this.props.merit.from} on {this.props.merit.date}:</Text>
                <Text style={styles.message}>{this.props.merit.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
      paddingBottom: Layout.standardPadding,
    },
    from:{
        color: Colors.palette.mediumPurple,
        fontSize:10,
        fontFamily: 'assistant-light',
    },
    message:{
        marginTop:4,
        fontSize:14,
        lineHeight:24,
        fontFamily: 'assistant-light',
    },
});