import React,{Component} from 'react';
import {
    View,
    Text,
    Platform
} from 'react-native';

import firebase from 'react-native-firebase';

class Tasklist extends React.Component{

    constructor(){
        super();
        
        this.currentUser = firebase.app().auth();
        
        this.state={
            currentUser: this.currentUser,
        }
    }

    render(){
        console.log("Current user-->"+JSON.stringify(this.state.currentUser))
        const {currentUser} = this.state.currentUser;
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Tasklist Screen!</Text>
                <Text style={styles.text}>{currentUser.email}!</Text>
            </View>
        );
    }
}

const styles={
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:Platform.OS === 'ios' ? 21 : 0,
        backgroundColor: '#455a64',
    },
    text:{
        fontSize:24,
        color:'white'
    }
}

export default Tasklist;