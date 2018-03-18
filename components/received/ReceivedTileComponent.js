import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    Animated,
} from 'react-native';
import ReceivedLightbox from './ReceivedLightbox';
import GlobalStyles from '../../constants/GlobalStyles';
import Layout from '../../constants/Layout';
import {webStorage} from "../../api/firebase";
import Colors from '../../constants/Colors';
import {CacheManager} from 'react-native-expo-image-cache';

export class ReceivedTileComponent extends React.Component {
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
            // TODO: Don't know why the cache manager isn't working
            // CacheManager.cache(url, (newURI) => {
            //     console.log('newURI',newURI);
            //     originalThis.setState({ image: {uri: newURI} })
            // });
        }).catch(function(error) {
            // Handle any errors
            console.log('image error',error);
        });
    }

    renderCountBadge(){
        var count = this.props.merit.instances?this.props.merit.instances.length:0;
        if(count>=1) {
            return <View style={styles.badgeContainer}><Text style={styles.badgeText}>{count + 1}</Text></View>
        } else {
            return null;
        }
    }


    render() {
        let size = this.props.size || 100;
        let sizeStyle = {
            height: size+Layout.standardPadding,
            width: size+Layout.standardPadding,
            flexBasis: size+Layout.standardPadding,
        }
        const preview = this.state.image;
        const image = this.state.image;
        return (
            <ReceivedLightbox merit={this.props.merit} springConfig={{bounciness:100, speed:50}} swipeToDismiss={false} underlayColor={'#fff'} backgroundColor={'#fff'}>
                <View style={[styles.card,sizeStyle]}>
                    <Image style={GlobalStyles.fullWidthImage} source={this.state.image} />
                    <Text style={styles.text}>{this.props.merit.text}</Text>
                    {this.renderCountBadge()}
                </View>
            </ReceivedLightbox>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexGrow: 0,
        flexShrink: 0,
        padding:Layout.standardPadding/2,
    },
    text:{
        color: '#000',
        width: 100,
    },
    badgeContainer:{
        position: 'absolute',
        bottom: 7,
        right: 7,
        padding:1,
        paddingRight:5,
        paddingLeft:5,
        backgroundColor: Colors.palette.lightPurple,
        borderRadius:20,
    },
    badgeText:{
        color: '#fff',
        fontSize:10,
    }
});