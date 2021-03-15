import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,ImageBackground,TouchableOpacity,Image,ScrollView,SafeAreaView,ActivityIndicator,RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import firebase from './firebase';
import "firebase/auth";

export default function Account(params,{ navigation }){
    const [userName,setUserName] = useState('');
    const [constructorHasRun,setConstructorHasRun] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const userId = params.route.params.userId;
    const navigation1 = useNavigation();

    const logOut = ()=>{
      //console.log("Logged out");
      try{
        firebase.auth().signOut();
        navigation1.navigate('Login');
      }
      catch(err){
        console.log("Error",err)
      }
    }
    const constructor = ()=>{
      if(constructorHasRun){
          return;
      }
      //retrieveData();
      firebase.auth().onAuthStateChanged(user =>{
            //console.log(user,"pakalam pa");
            if(user){
                //console.log(user);
                setUserName(user.email)
            }
            setRefreshing(false);
        })
    
      setConstructorHasRun(true);
    }
    
    constructor();

    return(
        <ImageBackground
            style={Styles.image}
            source={
                require('./static/bgimg7.jpg')
            }>
            <View style={Styles.container}>
                <ScrollView style={{width:"100%",top:"15%"}} refreshControl={
                        <RefreshControl refreshing={refreshing} />}>
                    <View style={{flexDirection:"column",width:"100%",height:"100%",flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Image  source={require('./static/profile.png')}
                        style={{height: 150,
                                width: 150,
                                borderRadius:0,}}
                                resizeMode ="contain"
                    />

                    <TouchableOpacity onPress={()=>{logOut()}} style={{padding:5,marginTop:15,flexDirection:"row",width:"100%",height:"100%",flex:1,justifyContent:"center",alignItems:"center"}}>
                    <View style={{backgroundColor:"cyan",flexDirection:"row",height:50,borderRadius:10,width:150,alignItems:"center",justifyContent:"center"}}>
                        < Icon name={"power-off"} color={"#ED4337"} type="font-awesome" style={{margin:7}}/>
                        <Text style={{alignSelf:"center",color:"white",fontWeight:"bold",fontSize:14 }}>
                            LogOut
                        </Text>
                    </View>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        </ImageBackground>

    );

}


const Styles = StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor: '#171A1F',
        justifyContent:'center',
        alignItems:'center',
    },
    logo:{
        color:"white",
        fontSize:40,
        fontWeight:"bold",
        marginBottom:30,
    },
    inputView:{
        width:"100%",
        borderRadius:5,
        height:60,
        marginBottom:20,
        color:"white",
        justifyContent:"center",
        padding:20,
        elevation:20,
        borderBottomColor:"grey",
        borderBottomWidth:2
      },
      forgot:{
        color:"white",
        fontSize:11
      },
      loginBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        elevation:20,
      },
      image: {
    width: '100%',
    height: '100%',
 },
})