import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import Colors from '../constants/Colors';

export default class OfflineScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{alignItems:'center',justifyContent:'center',height:'100%',width:'100%'}}>
                <Image source={require('../assets/images/icon.png')} style={{width:50,height:50}}></Image>
                <Text style={{color:Colors.palette.mediumPurple,width:200,textAlign:'center',lineHeight:18,marginTop:16}}>You are offline.{"\n\n"}This app requires an internet connection to function properly.{"\n\n"}Please check your network connection.</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});
