import React, { Component } from 'react';
import {
    Text, View,
    Platform, Dimensions,
    TextInput,ScrollView
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

import firebase from 'react-native-firebase';

var screen = Dimensions.get('window');

//DATABASE REFERENCE
const rootRef = firebase.database().ref(); 
const messageRef = rootRef.child('message');

export default class AddModal extends Component{
    
    constructor(props){
        super(props);

		this.currentUser = firebase.app().auth();

        this.state=({
			
			currentUser: this.currentUser,

			post:'',
			
			senderName: '',
			message:'',
			key:'',
        });
    }

    showAddModal = (senderName,message,key) =>{
        this.refs.myModal.open();
        //console.log("senderUid: "+item.senderUid);
        //console.log("key: "+key);
        this.setState({
			senderName:senderName,
			message: message,
			key: key,
        });
        
	}
	
	deleteMessage = (key) =>{
		const {currentUser} = this.state.currentUser;
		
		messageRef.child(currentUser.uid).child(key).remove();

		this.refs.myModal.close();
	}

    render(){
        //const post = this.state.post;
        return(
            <Modal
                ref={"myModal"}
                style={{
                    borderRadius: Platform.OS === 'ios' ? 30 : 0,
                    shadowRadius:10,
					flex:0.3,
					width: screen.width - 40,
				}}
				position='center'
				swipeToClose={false}
                backdrop={true}
                onClosed={() => {

                }}
            >	
				<View style={styles.container}>
					<ScrollView>
						<View style={styles.item}>
							<Text style={styles.header}> User ID: </Text>
							<Text style={styles.text}>{this.state.senderName}</Text>
						</View>
						<View style={styles.item}>
							<Text style={styles.header}> Mesaj: </Text>
							<Text style={styles.text}>{this.state.message}</Text>
						</View>

						<View style={styles.buttons}>
							<Button
								style={{fontSize: 18, color:'white',}}
								containerStyle={{
									padding: 8,
									margin:10,
									height: 40,
									width:100,
									borderRadius: 6,
									backgroundColor:'blue',
								}}
								onPress={()=> this.refs.myModal.close()}
							>
								Cancel
							</Button>

							<Button
								style={{fontSize: 18, color:'white',}}
								containerStyle={{
									padding: 8,
									margin:10,
									height: 40,
									width:100,
									borderRadius: 6,
									backgroundColor:'red',
								}}
								onPress={() => this.deleteMessage(this.state.key)}
							>
								Delete
							</Button>
						</View>
					</ScrollView>
				</View>
				    
            </Modal>
        );
    }

}

const styles={
	container:{
		flex:1,
		borderRadius:40,
		marginTop:10,
		padding:10
	},
	item:{
		flex:1,
		flexDirection:'row',
		paddingRight:40,
		paddingLeft:10,
		marginBottom:10,
	},
	header:{
		fontSize: 20,
		fontWeight: 'bold',
	},
    text:{
        fontSize: 20,
		fontWeight: 'bold',
		textAlign:'center',
		marginLeft:10
	},
	buttons:{
		flex:1,
		flexDirection:'row',
		marginTop:10,
		justifyContent: 'center',
	}
}

/* 

	<View style={{
				flex:1,
				backgroundColor:'black',
				borderRadius:40, 
				flexDirection:'row',
				alignItems:'center',
				justifyContent:'center',
				paddingRight:50,paddingLeft:50}}>
				<Text style={styles.header}> User ID: </Text>
				<Text style={styles.text}>{this.state.senderName}</Text>
			</View>

*/