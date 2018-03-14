import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import stateManager from "../api/stateManager";

export class LogoHeader extends React.Component {
    constructor(props){
        super(props);
    }

    _handleLogoClick() {
        console.log('header logo click');
        if(this.props.navigation && stateManager.user && stateManager.user.email){
            console.log('going home',this.props.navigation);
            this.props.navigation.navigate('Home');
        }
    }

    render() {
        return (
            <View>
                {this.props.short==true ? (
                    <View style={[styles.containerShort,{height: this.props.height || 44}]}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <TouchableOpacity style={{height:this.props.height || 44,width:this.props.height || 44}} onPress={() => this._handleLogoClick()}>
                            <Image style={[styles.imageShort,{flexBasis:(this.props.height || 44)-Layout.standardPadding}]} source={require('../assets/images/logo-short.png')} />
                        </TouchableOpacity>

                    </View>
                ) : (
                    <View style={[styles.container,{height: this.props.height || 130}]}>
                        <Image style={styles.image} source={require('../assets/images/logo.png')} />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: Colors.brandLight,
        //padding: Layout.standardPadding,
        //borderBottomColor: Colors.brandMedium,
        //borderBottomWidth: 1,
    },
    containerShort: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Colors.brandLight,
        padding: Layout.standardPadding/2,
        //paddingBottom: Layout.standardPadding/1.25,
        borderBottomColor: Colors.brandMedium,
        borderBottomWidth: 1,
    },
    image: {
        flex:1,
        height: undefined,
        width: undefined,
        resizeMode: 'contain',
    },
    imageShort: {
        flex:0,
        height: undefined,
        width: undefined,
        resizeMode: 'contain',
    },
    title:{
        position: 'absolute',
        width: '100%',
        textAlign:'center',
        paddingTop: 12,
        paddingLeft: Layout.standardPadding,
        height: 44,
        color: Colors.palette.darkBlue,
        fontSize: 16,
    }
});