import React, {Component} from 'react';
import {
	Platform, 
	Text, 
	View,
	FlatList,
	TextInput,
	Button,
	YellowBox
} from 'react-native';

//YellowBox.ignoreWarnings(['Require cycle:']);

import firebase from 'react-native-firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-material-dropdown';
import AddModal from '../config/AddModal';

const iosConfig ={
};

const androidConfig ={

};

/**
 const animalApp = firebase.initializeApp(
	 //use platform specific firebase config
	 Platform.OS === 'ios' ? iosConfig : androidConfig,
	 //name of this app
	 'animalApp'
 );
 * 
 */

//Database reference
const rootRef = firebase.database().ref(); 
const userRef = rootRef.child('users');
const messageRef = rootRef.child('message');

export default class Home extends Component{

	constructor(){
		super();

		this.state=({
			currentUser: null, 			//uygulamaya bağlı olan kullanıcının verisinin tutulduğu obje.

			posts : [],					//Firebase "message" tablosundaki verilerin tutulacağı dizi.

			message: '',				//"message" tablosuna gönderilecek olan parametreler.
			userUid: '',

			usernameList: [],			//"users" tablosundan name verilerini tutucağım
			userUidList: [],			//"users" tablosundan uid verilerini tutucağım.
			nameList: [],				//user tablosundaki name'i JSON formatında tutucam. Dropdown menude Json formatında istiyor
			value:'',					//dropdown menudeki değeri tutuyor
		});

		this.showInfoMessage = this.showInfoMessage.bind(this);
	}

	//Firebase'den verileri çekme işlemini renderdan sonra çalışan componentDidMount fonksiyonu ile yapacağız,
	componentDidMount(){
		console.log("(Home) Component Did Mount");
		const currentUser = this.state.currentUser;

		//post'taki senderUid'yi isme dönüştürmek için user tablosundan uid ve ona eş name verilerini alıp
		// yazacağım fonksiyon yardımıyla uid'yi isme dönütürüp FlatList'te gönderen kişinin ismini yazdıracağım
		let usernameList = [];
		let userUidList = [];
		let nameList = [];
		userRef.on('value',(dataSnapshot) =>{
			console.log("(Home) Component Did Mount (userRef)");
			dataSnapshot.forEach((obj)=>{
				usernameList.push(obj.toJSON().name); //veriler string dizisi şeklinde saklanacak
				userUidList.push(obj.toJSON().uid);

				nameList.push({
					value: obj.toJSON().name,
				})

			});
			
		});

		//Firebase'in "message" tablosundan verileri çekeceğiz
		messageRef.child(currentUser.uid).on('value', (dataSnapshot)=>{
			let posts = []; 							//dataSnapshot ile çektiğimiz verileri bu diziden tutacağız ardından setState metodu ile state'teki posts dizisine atacağız.
			console.log("(Home) Component Did Mount (messageRef)");
			dataSnapshot.forEach((obj)=>{ 				//dataSnapshot verilerini forEach döngüsü ile tek tek ayıkladık ve
				posts.push({							// push metodu ile posts dizisine atadık.
					key : obj.key,
					senderUid: obj.toJSON().senderUid,  //Json formatında
					message: obj.toJSON().message
				});
				//console.log("key --->" +obj.key);   //key database'deki keylerini alıyor.
				this.setState({
					posts:posts,
				})
			});
		});
		

		this.setState({
			usernameList: usernameList,
			userUidList: userUidList,					//State'teki posts dizisine gönderdik.
			nameList: nameList,
		});
	}

	//renderdan önce çalışan react fonksiyonu
	componentWillMount(){
		console.log("(Home) Component Will Mount");
		const {currentUser} = firebase.app().auth()  	//uygulama giriş yapmış olan auth'un verilerini currentUser objesine attık.
		this.setState({currentUser});			// bütün fonksiynların erişebilmesi için state'e gönderdik.
	
	}

	sendMessage = () =>{
		const message = this.state.message; 	//state'teki message değişkeni
		const userUid = this.convertUsernameToUid(this.state.userUid); 	//state'teki userId değişkeni
		const currentUserUid = this.state.currentUser.uid;

		var key = messageRef.push().key;		//Firebase'den unique bir key değeri alıyoruz

		messageRef.child(userUid).child(key).set({  //message tablosunda alıcı user'ın uid'si alanına gönderiyoruz.
			message: message,
			senderUid: currentUserUid,
			userUid: userUid
		});

		messageRef.child(userUid).child(key).push();
	}

	showUidToUsername(uid){
		const usernameList = this.state.usernameList;
		const userUidList = this.state.userUidList;

		for(let i = 0; i < usernameList.length; i++){
			if(uid == userUidList[i]){
				return usernameList[i];
			}
		}

		return usernameList[0];
	}

	convertUsernameToUid(){
		const username = this.state.value;
		const usernameList = this.state.usernameList;
		const userUidList = this.state.userUidList;

		for(let i = 0; i < userUidList.length; i++){
			if(username == usernameList[i]){
				return userUidList[i];
			}
		}

		return userUidList[0];
	}

	showInfoMessage = (item) =>{
		//FlatList'ten seçilen elemanların bilgilerini aldım
		let senderName = this.showUidToUsername(item.senderUid); 
		let message = item.message;
		let key = item.key

		//AddModal'daki showAddModal fonksiyonuna parametre olarak gönderdim
		this.refs.addModal.showAddModal(senderName,message,key); 
	}

	render() {
		//const user = this.state.currentUser;
		console.log("(Home - Render)");

		const data = this.state.nameList; 	//state'te json users tablosundan JSON formatında çektiğim name verilerini bir dizide tutalım.

    	return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={{flex:1}}>
						<Dropdown 
							label='User UID'
							data={data}
							onChangeText={ (value) => this.setState({value: value})}
							pickerStyle={{backgroundColor:'#718792',flex:1,marginTop:100}}
							textColor="white"
							fontSize={20}
							baseColor="gray"
							value="Emre Aydın"
							
						/>
					</View>
				</View>
				<View style={styles.header}>
					<Text style={{fontSize:18, fontWeight:'bold', color:'white',flex:1}}>Mesaj</Text>
					<TextInput
						style={styles.input}
						placeholder={"Mesajı giriniz"}
						placeholderTextColor="gray"
						onChangeText={ (text) => (this.setState({ message: text}))}
					/>
				</View>
				<View style={{flex:0.8,}}>
					<Button 
						title="Gönder"
						onPress={this.sendMessage}
					/>
				</View>
				
				<View style={{marginTop:5,height:0.8, backgroundColor:'gray',marginHorizontal:10}}></View>
				<View style={styles.list}>
					<FlatList
						data={this.state.posts}
						renderItem={({item,index})=>{
							return(
								<TouchableOpacity style={{
									backgroundColor:'white',
									borderRadius:10,
									margin:10,
									paddingLeft:10,
									}}
									onPress={() => this.showInfoMessage(item)}
									>
										<Text
											style={{
												fontSize:18,
												fontWeight: 'bold',
												margin:10,
											}}
										>
											{this.showUidToUsername(item.senderUid)}
										</Text>
										<Text
											style={{
												fontSize:18,
												fontWeight: 'bold',
												margin:10,
											}}
										>
											{item.message}
										</Text>
										
								</TouchableOpacity>
							);
						}}
					>

					</FlatList>
					
				</View>
				<AddModal ref={'addModal'} parentFlatList={this} >

				</AddModal>
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
	  flex:1,
	  flexDirection:'row',
	  justifyContent:'center',
	  alignItems:'center',
	  paddingLeft:8,
	  margin:8
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
