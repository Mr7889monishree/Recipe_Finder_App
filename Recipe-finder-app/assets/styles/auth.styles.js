import {StyleSheet,Dimensions} from "react-native";
import { COLORS } from "../../constants/COLORS.js";
COLORS
const {height}=Dimensions.get("window");


export const authStyles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.background
    },
    keyboardView:{
        flex:1//combination of flex grow,shrink and basis
    },
    scrollContent:{
        flexGrow:1,//items after being taking space and after given manually for the remaining space to be taken by the items we have to give flexgrow for responsiveness as we extend the device width or height the items to taken the given space accordingly
        paddingHorizontal:24,
        paddingTop:40,   
    },
    imageContainer:{
        height:height*0.3,
        marginBottom:45,
        justifyContent:"center",
        alignItems:"center",
    },
    image:{
        width:320,
        height:320,
    },
    title:{
        fontSize:28,
        color:COLORS.text,
        fontWeight:"bold",
        textAlign:"center",
        marginBottom:40,
    },
    subtitle:{
        fontSize:16,
        fontWeight:450,
        colors:COLORS.textLight,
        textAlign:"center",
        marginBottom:30,
        opacity:0.5,
    },
    formContainer:{
        flex:1,//for the responsiveness across multiple devices
    },
    inputContainer:{
        marginBottom:20,
        position:"relative",
    },
    textInput:{
        fontSize:16,
        color:COLORS.text,
        paddingVertical:16,
        paddingHorizontal:20,
        backgroundColor:COLORS.background,
        borderRadius:12,
        borderWidth:1,
        borderColor:COLORS.border
    },
    eyeButton:{
        position:"absolute",
        right:16,
        top:16,
        padding:4,
    },
    authButton:{
        backgroundColor:COLORS.primary,
        paddingVertical:18,
        borderRadius:12,
        marginTop:20,
        marginBottom:30,
    },
    buttonDisabled:{
        opacity:0.7,
    },
    buttonText:{
        fontSize:16,
        fontWeight:"600",
        color:COLORS.white,
        textAlign:"center",
    },
    linkContainer:{
        alignItems:"center",
        paddingBottom:20,
    },
    linkText:{
        fontSize:16,
        color:COLORS.textLight,
    },
    link:{
        color:COLORS.primary,
        fontWeight:"600",
    }
})