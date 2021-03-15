import React,{Component,useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,ScrollView,ActivityIndicator,RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase';
import "firebase/auth";
import "firebase/database";

function SignUp({navigation }){

    const [userName,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [error,setError] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigation1 = useNavigation();
   // const {userId } = route.params;
    //console.log(params,"params");
    const [constructorHasRun,setConstructorHasRun] = useState(false);
    
    const storeData = async ()=>{
        try{
            //console.log("its now pressed",username,email,password);
            //await AsyncStorage.setItem("userName",username  );
            navigation1.push('Login')
        }
        catch(error){
            console.log(error);
        }
    }

    const signupPress = ()=>{
        if(userName!='' && password!=''){
            setRefreshing(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid;
                   // console.log("uid ::: ",uid);

                    navigation1.navigate("Login")
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
        console.log("act like constructor");
        setConstructorHasRun(true);
    }
    constructor();

    const onRefresh = React.useCallback(() => {
        
        
    }, []);

    
    return(

        <View style={Styles.container}>
        <ScrollView contentContainerStyle={{alignItems:"center",justifyContent:"center"}} style={{width:"80%",top:"15%"}}  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={{padding:0,width:"100%",alignItems:"center",justifyContent:"center"}}>
                <Text style={Styles.logo}>AnimeFox</Text>   
                <Text style={error?{color:"#ED4337",fontsize:11,padding:10,flex:1,justifyContent:"center",textAlign:"center"}:{display:"none"}}> {errorMessage} </Text> 
                <TextInput style={Styles.inputView} placeholder="Username" placeholderTextColor="grey" onChangeText={(text)=>{setUserName(text)}}></TextInput>
                <TextInput style={Styles.inputView} placeholder="Email Id" placeholderTextColor="grey" onChangeText={(text)=>{setEmail(text)}}></TextInput>
                <TextInput style={Styles.inputView} placeholder="Password" placeholderTextColor="grey" secureTextEntry={true} onChangeText={(text)=>{setPassword(text)}}></TextInput>
                <TouchableOpacity style={Styles.signupBtn} onPress={()=>signupPress()}>
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
        marginBottom:15,
        color:"white",
        justifyContent:"center",
        padding:20,
        elevation:15,
        borderBottomColor:"grey",
        borderBottomWidth:2
      },
      signupBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10,
        elevation:20,
      },
})


export default SignUp;