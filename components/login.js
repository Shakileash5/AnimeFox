import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Button,ScrollView,SafeAreaView,ActivityIndicator,RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase';
import "firebase/auth";

function Login({ navigation }){

    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const navigation1 = useNavigation();
    const [isLoading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [constructorHasRun,setConstructorHasRun] = useState(false);


    const loginPress = ()=>{
        //console.log("inside");
        if(userName!="" && password!=""){
            setRefreshing(true);
            firebase.auth().signInWithEmailAndPassword(userName,password).then((response)=>{
                const uid = response.user.uid;
                //console.log(uid,":: uid");
                navigation1.navigate('MyTabs',{userId:uid.toString()});
                
            }).catch(err =>{
                console.log("err",err);
                setError(1);
                setErrorMessage(err.message); 
            }).finally(()=>{
                setRefreshing(false);
            });
        }
        else{
            setError(1);
            setErrorMessage("Enter userName and password");
        }
    }

    const constructor = ()=>{
        if(constructorHasRun){
            return;
        }
        //console.log("act like constructor");
        //retrieveData();
        setRefreshing(true);
        firebase.auth().onAuthStateChanged(user =>{
            //console.log(user,"pakalam pa");
            if(user){
                navigation1.navigate('MyTabs',{userId:user.uid.toString()});
            }
            setRefreshing(false);
        })
        setConstructorHasRun(true);
    }
    constructor();

    const onRefresh = React.useCallback(() => {
        
        
    }, []);

    return(

        <View style={Styles.container}>
            <ScrollView style={{width:"100%",top:"15%"}} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{alignItems:'center',padding:20,width:"100%"}}>
                    <Text style={Styles.logo}>AnimeFox</Text>
                    <Text style={error?{color:"#ED4337",fontSize:11,padding:10,flex:1,justifyContent:"center",textAlign:"center"}:{display:"none"}}> {errorMessage} </Text>
                    <TextInput style={Styles.inputView} placeholder="Email Id" placeholderTextColor="grey" onChangeText={(text)=>{setUserName(text);}}  ></TextInput>
                    <TextInput style={Styles.inputView} placeholder="Password" placeholderTextColor="grey" secureTextEntry={true} onChangeText={(text)=>{setPassword(text);}} ></TextInput>
                    <TouchableOpacity>
                        <Text style={Styles.forgot}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.loginBtn} onPress={() => {loginPress(); }}>
                        <Text style={{color:"white",fontWeight:"bold"}}>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {navigation1.push('SignUp'); }}>
                        <Text style={{color:"white",fontWeight:"bold"}}>SIGNUP</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>

    );

}


const Styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#171A1F',
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
})


export default Login;