import {StyleSheet} from "react-native";
import Layout from './Layout';
import Colors from './Colors';

export default StyleSheet.create({
    container: {
        // padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    textinput: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.palette.mediumPurple,
        padding: 12,
        borderRadius: 4,
        fontFamily: 'assistant-regular',
        fontSize: 14,
    },
    errorText: {
      color: 'red',
    },
    sectionHeader: {
        margin: Layout.standardPadding,
        marginBottom: Layout.standardPadding/4,
        fontSize:16,
        fontFamily: 'assistant-light',
    },
    buttonStandard: {
        backgroundColor: Colors.palette.darkBlue,
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
        borderWidth: 0,
    },
    buttonStandardText: {
        color: '#fff',
        fontFamily: 'assistant-regular',
        fontSize: 14,
    },
    buttonLink: {
        borderWidth: 0,
    },
    buttonLinkText: {
        color: Colors.palette.darkBlue,
        fontFamily: 'assistant-regular',
        fontSize: 14,
    },
    fullWidthImage:{
        aspectRatio: (1/1), // Image dimensions are known: 600, 330
        width: '100%',
        height: '100%',
        // Make sure the image doesn't exceed it's original size
        // If you want it to exceed it's original size, then
        // don't use maxWidth / maxHeight or set their
        // value to null
        maxWidth: Layout.window.width-(Layout.standardPadding*2),
        maxHeight: Layout.window.width-(Layout.standardPadding*2),
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
    },
    spacer:{
        padding: Layout.standardPadding/2,
    },
    spacerPageBottom:{
        padding: Layout.standardPadding*2,
    },
    divider: {
        borderBottomColor: Colors.brandMedium,
        borderBottomWidth: 1,
    },
    snackBar:{
        position: 'absolute',
        bottom: Layout.standardPadding,
    },
    pickerContainer:{
        borderWidth: 1,
        borderColor: Colors.palette.mediumPurple,
        borderRadius: 4,
        marginBottom: 12,
        paddingRight: 8,
    },
    picker:{
        padding:0,
        margin:0,
        height: 42,
    },
    pickerItem:{
        height: 16,
        fontFamily: 'assistant-regular',
        fontSize: 14,
    }
});