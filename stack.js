import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet} from 'react-native';
import VideoStream from "./player";
import WebView from "./WebView";
import AnimePage from "./animePage";
import SignUp from "./signup";
import Login from "./login";
import MyTabs from "./bottomTab";

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <NavigationContainer>{
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} 
                options={{
                        headerShown:false,
                    }} 
            />
            <Stack.Screen name="SignUp" component={SignUp} 
                options={{
                        headerShown:false,
                    }} 
            />
            <Stack.Screen name="MyTabs" component={MyTabs} 
                options={{
                        headerShown:false,
                    }} 
            />
            <Stack.Screen name="AnimePage" component={AnimePage}
             options={{
                    headerShown:false,
                    headerTransparent: true,
                    headerTitleStyle:{color:"grey"},
                    
                }} 
            />
            <Stack.Screen name="VideoStream" component={VideoStream} 
                options={{
                        headerShown:false,
                    }} 
            />
            <Stack.Screen name="WebView" component={WebView} 
                options={{
                        headerShown:false,
                    }} 
            />
            
        </Stack.Navigator>



    }
    </NavigationContainer>
    
  );
}