import React, {Component} from 'react';
import {
	Platform,
	Text, 
	View,
	Button,
	TextInput,
	FlatList,
	TouchableOpacity,
	
} from 'react-native';
import firebase from 'react-native-firebase';

const rootRef = firebase.database().ref(); 
const userRef = rootRef.child('users');

export default class Profile extends Component{

	constructor(){
		super();

		this.state={
			currentUser: null,
		}
	}

	componentDidMount(){
		console.log("Component Did Mount")
		//database'deki verileri çekmek ve FlatList'te göstermek için on metodunu kullanacağı"
		
		userRef.on('value', (dataSnaphot)=>{
			const users = [];
			dataSnaphot.forEach((doc)=>{
				users.push({
					key: doc.key,
					uid: doc.toJSON().uid,
					email: doc.toJSON().email,
					name: doc.toJSON().name,
				});
				this.setState({
					users: users,
					username: doc.toJSON().name,
				});
			});
		});

	}

	//renderdan önce çalışan fonksiyon
	componentWillMount() {
        const {currentUser} = firebase.auth()
        this.setState({ currentUser });
	}
	
	signOut = () =>{
        //console.log("(Profile) Log out click!");
		firebase.auth().signOut();
		
		const { currentUser } = firebase.auth()
		
		this.setState({ currentUser })
		
		{this.props.navigation.navigate("Login")}
	}
	
	showInfo = (item) =>{
		console.log("onPressDel metodu çalıştı!!");
		console.log("id ---> "+item.uid);
		alert(item.uid+' '+item.email+'\n'+item.name);
		//animalRef.child(''+id).remove()

	}

	render() {
		const currentUser = this.state.currentUser;
    	return (

			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={{fontSize:24,color:'white',fontWeight:'bold'}}>{currentUser.email}!</Text>
					<Text style={{fontSize:24,color:'white',fontWeight:'bold'}}>Profile Screen</Text>
					<Button
						title={"Çıkış Yap"}
						onPress={this.signOut}
					/>
				</View>
				
				<View style={{marginTop:5,height:0.8, backgroundColor:'gray',marginHorizontal:10}}></View>
				<View style={styles.list}>
					<FlatList
						data={this.state.users}
						renderItem={({item, index}) =>{
							return(
								<TouchableOpacity style={{
									backgroundColor:'white',
									borderRadius:10,
									margin:10,
									paddingLeft:10,
									}}
									onPress={() => this.showInfo(item)}
									>
										<Text
											style={{
												fontSize:18,
												fontWeight: 'bold',
												margin:10,
											}}
										>
											{item.uid}
										</Text>
										<Text
											style={{
												fontSize:18,
												fontWeight: 'bold',
												margin:10,
											}}
										>
											{item.email}
										</Text>
										<Text
											style={{
												fontSize:18,
												fontWeight: 'bold',
												margin:10,
											}}
										>
											{item.name}
										</Text>
								</TouchableOpacity>
							);
						}}
					>

					</FlatList>
				</View>
			</View>
    	);
  	}
}

const styles = {
  container: {
    flex: 1,
    marginTop:Platform.OS === 'ios' ? 21 : 0,
    backgroundColor: '#455a64',
  },
  welcome: {
    fontSize: 20,
    color:'white',
    textAlign: 'center',
    margin: 10,
  },
  header:{
	  flex:2,
	  justifyContent:'center',
	  alignItems:'center',
	  paddingLeft:8,
  },
  list:{
	  flex:7,
	  marginTop:20
  },
  input:{
	  flex:3,
	  height:40,
	  margin:10,
	  paddingLeft:14,
	  borderRadius:25,
	  backgroundColor:'white',
	  color:'black'
  }
};

