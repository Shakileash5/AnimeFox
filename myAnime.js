import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,ActivityIndicator,Button,Image,SafeAreaView,ScrollView,TouchableOpacity,RefreshControl   } from 'react-native';
import { IconButton, Colors,ProgressBar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { useNavigation } from '@react-navigation/native';
import firebase from './firebase';
import "firebase/auth";
import "firebase/database";

export default function MyAnime(params,{navigation}) {
    const [progress,setProgress] = useState(0.8);
    const [loaclObj,setLoaclObj] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const navigation1 = useNavigation();
    const baseUrl = "https://serene-fortress-54214.herokuapp.com";//"http://127.0.0.1:5000";
    const animeUrl = "https://gogo-play.net/";
    const userId = params.route.params.userId;
    //console.log("id",userId)

    const fetchData = ()=>{
        const uid = "sN6kQOuXsRhmkBcpfGyvzoBnjZ02";
        setRefreshing(true);
        try{
                //const uid = "sN6kQOuXsRhmkBcpfGyvzoBnjZ02";//response.user.uid;
                //console.log("uid ::: ",uid);
                firebase.database().ref("User/"+userId).once("value",function(animeList){
                    
                    
                    //console.log("animes",animeList,animeList.val());
                    if (animeList.val()!=null){
                        let animes = animeList.val()["animeList"];
                        setLoaclObj(animes); 
                        } 
                        setRefreshing(false);
                    //console.log("local ::: ",loaclObj);  
                    }
                     
                    
                ).catch((error)=>{
                    console.log(exceperrortion);
                    setRefreshing(false);
                });
            }
            catch(exception){
                console.log(exception);
                setRefreshing(false);
            }
    }

    const navigatePage = (data)=>{
        //console.log(data,navigation);
        let arr = data["url"].split("-");
        arr[arr.length-1]="1";
        let link = arr.join("-")
        let url = animeUrl+data["url"].slice(22,data["url"].length);
        navigation1.navigate('AnimePage',{urlParam:url,uid:userId});
    }

    useEffect(()=>{
        fetchData();
    },[]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        
    }, []);

    console.log(loaclObj)
    return (
            <View style={styles.container}>
                <View elevation={25} style={styles.header}> 
                    <Image  source={require('./static/anime_fox.png')}
                        style={{height: 30,
                                width: 160,
                                borderRadius:0,}}
                                resizeMode ="stretch"
                    />
                </View>
                <View style={{padding:5}}>
                    <Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> Favourites </Text>
                </View>
                {
                    loaclObj==[]?<View><Text>No Favourites are available </Text></View>:
                    <ScrollView contentContainerStyle={{alignItems:"center"}} style={{top:0}}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    {   
                        loaclObj.map((obj,id)=>{
                            return (
                                <TouchableOpacity key={id}
                                    style={{height:120,width:"95%",padding:5,elevation:4,margin:10,borderRadius:10,backgroundColor:"#23252F"}}
                                    onPress= {()=>{navigatePage(obj)}} > 
                                        <View style={{flexDirection:"row",width:350,height:130,padding:5}}>
                                            <Image 
                                                source={{uri:obj["thumbnail"]||"https://cdnimg.xyz/cover/hunter-x-hunter-dub.png"}}
                                                style={styles.img}                 
                                            />
                                            <View style={{padding:10,width:230,left:"0%",alignItems:"stretch"}}>
                                                <Text adjustsFontSizeToFit={true} style={{textAlignVertical: "top",color:"white",fontSize:14,fontWeight:"bold"}}> {obj["name"]} </Text>
                                                
                                                <View style={obj["name"].search("Dub")!=-1?{backgroundColor:"#50B26B",borderRadius:5,width:50,height:20,justifyContent:"center",alignItems:"center",marginTop:5}:{backgroundColor:"#00A1FC",borderRadius:5,width:50,height:20,justifyContent:"center",alignItems:"center",marginTop:5}}>
                                                    <Text style={{color:"white",fontSize:13,fontWeight:"bold"}}>{obj["name"].search("Dub")!=-1?"DUB":"SUB"}</Text>
                                                </View>
                                                <View style={{flexDirection:"row",flex:1,height:10,paddingTop:3}}>
                                                    <Text style={{color:"grey"}}>Continue : </Text>
                                                    <View style={{backgroundColor:"#F9AA5F",height:23,borderRadius:4,marginLeft:2,alignItems:"center",padding:1,width:"60%"}}>
                                                        <Text style={{color:"white"}}> Episode {obj["episode"]+"/"+obj["totalEpis"]}</Text>
                                                    </View>
                                                    
                                                </View>
                                                <ProgressBar
                                                    progress={obj["episode"]/obj["totalEpis"]}
                                                    color={obj["episode"]/obj["totalEpis"]>0.5?(obj["episode"]/obj["totalEpis"]>0.7?Colors.green500:Colors.purple800):(obj["episode"]/obj["totalEpis"]<0.3?Colors.red800:Colors.purple400)}
                                                    style={{width:"90%",top:-15}}>
                                                </ProgressBar>
                                            </View>
                                        </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                }
            </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:"#191C22",
    paddingTop:0,//Constants.statusBarHeight,
    flexDirection:"column",
    backgroundColor:"#171A1F",
    zIndex:0,
  },
  searchBar:{
      backgroundColor:"#222630",//"#191C22",
      color:"grey",
      top:-3
      
  },
  searchText:{
      color:"white",
  },
  img:{
        flex:1, 
        height: 100, 
        width: "20%",
        alignSelf: 'stretch',
        zIndex:0,
        borderRadius:10,
        borderColor:"white",      
  },
  header:{
    flexDirection:"row",
    width:"100%",
    paddingTop:20,
    top:0,
    backgroundColor:"#222630",
    height:70,
    alignItems:"center",
    borderBottomColor: '#1F1F1F',
    borderBottomWidth: 0.7,
  },
});