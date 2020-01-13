import React from 'react';
import {createStackNavigator,createBottomTabNavigator,createAppContainer,createSwitchNavigator} from 'react-navigation';

import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import TasklistScreen from '../screens/Tasklist';
import LoginScreen from '../screens/Login';
import Loading from '../screens/Loading';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const tabBarIcon = name => ({ tintColor }) => (
    <MaterialIcons
      style={{ backgroundColor: 'transparent' }}
      name={name}
      color={tintColor}
      size={24}
    />
);

const TabNavigator = createBottomTabNavigator({
    Home:{
        screen: HomeScreen,
        navigationOptions:{
            title:'Home',
            tabBarIcon: tabBarIcon("home")
        }
    },
    Tasklist:{
        screen: TasklistScreen,
        navigationOptions:{
            title:'Tasklist',
            tabBarIcon: tabBarIcon("list")
        }
    },
    Profile:{
        screen: ProfileScreen,
        navigationOptions:{
            title:'Profile',
            tabBarIcon: tabBarIcon("person")
        }
    },

},
{
    tabBarOptions:{

        activeTintColor:'#3481FF',
        inactiveTintColor:'gray',
        style:{
            backgroundColor:'#1c313a'
        },
    }
}
);


const LoginStack = createStackNavigator({
    Login:{
        screen: LoginScreen,
        navigationOptions:{
            header: null
        }
    },
})

export default createAppContainer(createSwitchNavigator(
    {
        Loading: Loading,
        App :TabNavigator,
        Login:LoginStack
    }
));