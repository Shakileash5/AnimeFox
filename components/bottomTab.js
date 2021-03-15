import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Image,ScrollView,SafeAreaView,ActivityIndicator,RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyAnime from "./myAnime";
import AnimePage from "./animePage";
import Search from "./search";
import Home from "./home";
import Account from "./account"


const Tab = createBottomTabNavigator();

function HomeScreen(params) {
    //console.log("params",params.route.params.userId)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}



export default function MyTabs({route,navigation}) {

    const {userId } = route.params;
    return (
        
            <Tab.Navigator
            initialRouteName="Home"
            sceneContainerStyle={{backgroundColor:"grey"}}
            
            tabBarOptions={{
                activeTintColor: '#b575dd',
                inactiveTintColor: 'white',
                keyboardHidesTabBar:true,
                showLabel:false,
                style: { backgroundColor:"#23252F",borderTopColor:"#23252F" }
                
            }}
            >
            <Tab.Screen
                name="Home"
                component={Home}
                initialParams={{'userId':userId}}
                options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen
                name="search"
                component={Search}
                initialParams={{'userId':userId}}
                options={{
                tabBarLabel: 'Updates',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="search" color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen
                name="MyAnime"
                component={MyAnime}
                initialParams={{'userId':userId}}
                options={{
                tabBarLabel: 'Favourites',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="heart" solid={true} type='font-awesome' color={color} size={size} />
                ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                initialParams={{'userId':userId}}
                options={{
                tabBarLabel: 'Account',
                tabBarIcon: ({ color, size }) => (
                    <Icon name="user" solid={true} type='font-awesome' color={color} size={size} />
                ),
                }}
            />
            
            
            
            </Tab.Navigator>

    );
}