import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    Animated,
} from 'react-native';
import GivingLightbox from './GivingLightbox';
import GlobalStyles from '../../constants/GlobalStyles';
import Layout from '../../constants/Layout';
import {webStorage} from "../../api/firebase";

export class GivingTileComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            image: require('../../assets/images/placeholder.png'),
        }
    }

    componentDidMount(){
        this.loadMeritImage();
    }

    loadMeritImage(){
        let originalThis = this;
        //console.log("getting image", this.props.merit);
        webStorage.child('merits/' + this.props.merit.key + '@2x.png').getDownloadURL().then(function(url) {
            //console.log('got image uri',url);
            originalThis.setState({image:{uri: url}});
        }).catch(function(error) {
            // Handle any errors
            console.log('image error',error);
        });
    }

    render() {
        return (
            <GivingLightbox merit={this.props.merit} springConfig={{bounciness:100, speed:50}} swipeToDismiss={false} underlayColor={'#fff'} backgroundColor={'#fff'}>
                <View style={styles.card}>
                    <Image style={GlobalStyles.fullWidthImage} source={this.state.image} />
                    <Text style={styles.text}>{this.props.merit.text}</Text>
                </View>
            </GivingLightbox>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 100+Layout.standardPadding,
        width: 100+Layout.standardPadding,
        flexBasis: 100+Layout.standardPadding,
        flexGrow: 0,
        flexShrink: 0,
        padding:Layout.standardPadding/2,
        //borderWidth: 1,
        //borderColor: 'green',
    },
    text:{
        color: '#000',
        width: 100,
    }
});