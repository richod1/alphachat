import React from "react"
import {View,Text,StyleSheet} from "react-native"

const SplashScreen=()=>{
    return(
        <View style={styles.container}>
            <Text>SplashScreen</Text>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        aligItems:"center",
        flex:1,
        justifyContent:"center"
    }
})

export default SplashScreen;