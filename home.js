import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import Constants from "expo-constants";
import { ActivityIndicator,RefreshControl,StyleSheet, Text, View,ScrollView,TouchableOpacity,Image,ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
//import {FlatListSlider} from 'react-native-flatlist-slider';

export default function Home(params,{navigation}) {

    const [isLoading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(true);
    const [recent,setRecent] = useState([]);
    const [recentDub,setRecentDub] = useState([]);
    const [movies,setMovies] = useState([]);
    const [popular,setPopular] = useState([]);
    const userId = params.route.params.userId;

    const navigation1 = useNavigation();
    const baseUrl = "https://serene-fortress-54214.herokuapp.com";//"http://127.0.0.1:5000";
    const animeUrl = "https://gogo-play.net/"

    const getRecent = ()=>{
        setRefreshing(true);
        fetch(baseUrl+"/get_list?raw_link="+animeUrl)
        .then((response)=>{
            return response.json()

        }).then((json)=>{
            //console.log(json["result"]);
            var items = [];
            json = json["result"];
            Object.keys(json).map((data,i)=>{
                items.push(json[data])
            })
            //console.log(items)
            setRecent(items);
            setRefreshing(false);
        }).catch((exception)=>{
           // console.log("there is some prob");
            setRefreshing(false);
        });
    }

    const getRecentDub = ()=>{
        setRefreshing(true);
        fetch(baseUrl+"/get_list?raw_link="+animeUrl+"recently-added-dub")
        .then((response)=>{
            return response.json()

        }).then((json)=>{
            //console.log(json["result"]);
            var items = [];
            json = json["result"];
            Object.keys(json).map((data,i)=>{
                items.push(json[data])
            })
            //console.log(items)
            setRecentDub(items);
            setRefreshing(false);
        }).catch((exception)=>{
            //console.log("there is some prob");
            setRefreshing(false);
        });
    }

    const getMovies = ()=>{
        setRefreshing(true);
        fetch(baseUrl+"/get_list?raw_link="+animeUrl+"movies")
        .then((response)=>{
            return response.json()

        }).then((json)=>{
            //console.log(json["result"]);
            var items = [];
            json = json["result"];
            Object.keys(json).map((data,i)=>{
                items.push(json[data])
            })
            //console.log(items)
            setMovies(items)
            setRefreshing(false);
        }).catch((exception)=>{
            //console.log("there is some prob");
            setRefreshing(false);
        });
    }

    const getPopular = ()=>{
        setRefreshing(true);    
        fetch(baseUrl+"/get_list?raw_link="+animeUrl+"popular")
        .then((response)=>{
            return response.json()

        }).then((json)=>{
            
            //console.log(json["result"]);
            var items = [];
            json = json["result"];
            Object.keys(json).map((data,i)=>{
                items.push(json[data])
            })
            //console.log(items)
            setPopular(items)
            setRefreshing(false);
        }).catch((exception)=>{
            //console.log("there is some prob");
            setRefreshing(false);
        });
    }

    const navigatePage = (data)=>{
       // console.log(data,navigation);
        let arr = data["href"].split("-");
        arr[arr.length-1]="1";
        let link = arr.join("-")
        let url = animeUrl+link.slice(1,link.length);
        navigation1.navigate('AnimePage',{urlParam:url,uid:userId});
    }

    useEffect(() => {
        getRecent();
        getRecentDub();
        getMovies();
        getPopular();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getRecent();
        getRecentDub();
        getMovies();
        getPopular();
    }, []); 

    //console.log(recentDub)
    return(
        <ImageBackground
      style={styles.image}
      source={
          require('./static/bgimg7.jpg')
      }>
        <View style={styles.container}>
            <View elevation={25} style={styles.header}> 
                    <Image  source={require('./static/anime_fox.png')}
                        style={{height: 30,
                                width: 160,
                                borderRadius:0,}}
                                resizeMode ="stretch"
                    />
                
            </View>
            <ScrollView contentContainerStyle={{flexGrow:1}} style={{padding:5,}} showsVerticalScrollIndicator={false}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View style={styles.section}>  
                    <Text style={styles.sectionHead} > Popular </Text>
                    <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1}} style={{padding:0,}} showsHorizontalScrollIndicator={false}>
                        {
                            popular.map((data,id)=>{
                                return (
                                    <TouchableOpacity key={id} onPress={()=>{navigatePage(data)}}>
                                        <View style = {{    
                                            borderRadius:5,
                                            margin:5 }} 
                                        >
                                            <Image
                                                source={{uri:data.picture}}
                                                style={{height: 185,
                                                    width: 370,
                                                    borderRadius:4,
                                                    flexGrow:1,}}
                                            />
                                            <View style={styles.sCardTitle}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{color:"white",fontSize:12,width:"100%",fontWeight:"bold"}}>{data.descripton.length>27?data.descripton.substring(0,27)+"...":data.descripton}</Text>   
                                            </View>
                                            
                                        </View>
                                    </TouchableOpacity>
                                )
                            })    
                        }   
                    </ScrollView>
                </View>
                <View style={styles.section}>  
                    <Text style={styles.sectionHead} > Recently Added </Text>
                    <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1}} style={{padding:10,}} showsHorizontalScrollIndicator={false}>
                        {
                            recent.map((data,id)=>{
                                return (
                                        <TouchableOpacity key={id} onPress={()=>{navigatePage(data)}}>
                                            <View style = {styles.card} >
                                                <Image
                                                    source={{uri:data.picture}}
                                                    style={styles.cardImg}
                                                />
                                                <View style={styles.cardTitle}>
                                                    <Text style={{color:"white",fontSize:12,width:"100%",fontWeight:"bold"}}>{data.descripton}</Text>    
                                                </View>
                                                <View style={styles.cardDate}>
                                                    <Text elevation={25}  style={{ color: "white",fontWeight:"bold", paddingTop: 5 }}>
                                                        {data.date.search(":")==-1?(data.date).replace("ago","").replace("hours","hrs"):data.date.slice(0,10)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                )
                            })    
                        }   
                    </ScrollView>
                </View>
                <View style={styles.section}>  
                    <Text style={styles.sectionHead} > Movies </Text>
                    <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1}} style={{padding:10,}} showsHorizontalScrollIndicator={false}>
                        {
                            movies.map((data,id)=>{
                                return (
                                        <TouchableOpacity key={id} onPress={()=>{navigatePage(data)}}>
                                            <View style = {styles.sCard}  >
                                                <Image
                                                    source={{uri:data.picture}}
                                                    style={styles.sCardImg}
                                                />
                                                <View style={styles.sCardTitle}>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{color:"white",fontSize:12,width:"100%",fontWeight:"bold"}}>{data.descripton.length>27?data.descripton.substring(0,27)+"...":data.descripton}</Text>
                                                    
                                                </View>
                                                
                                            </View>
                                        </TouchableOpacity>
                                )
                            })    
                        }   
                    </ScrollView>
                </View>
                <View style={styles.section}>  
                    <Text style={styles.sectionHead} > Recently Added Dub </Text>
                    <ScrollView horizontal={true} contentContainerStyle={{flexGrow:1}} style={{padding:10,}} showsHorizontalScrollIndicator={false}>
                        {
                            recentDub.map((data,id)=>{
                                return (
                                        <TouchableOpacity key={id} onPress={()=>{navigatePage(data)}}>   
                                            <View style = {styles.card} >
                                                <Image
                                                    source={{uri:data.picture}}
                                                    style={styles.cardImg}
                                                />
                                                <View style={styles.cardTitle}>
                                                    <Text style={{color:"white",fontSize:12,width:"100%",fontWeight:"bold"}}>{data.descripton}</Text>
                                                    
                                                </View>
                                                <View style={styles.cardDate}>
                                                    <Text elevation={25} style={{ color: "white",fontWeight:"bold", paddingTop: 5 }}>
                                                        {data.date.search(":")==-1?(data.date).replace("ago","").replace("hours","hrs"):data.date.slice(0,10)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                )
                            })    
                        }   
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    </ImageBackground>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:"#191C22",
    paddingTop:0,//Constants.statusBarHeight,
    flexDirection:"column",
    zIndex:0,
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
  section: {
      padding:15,
  },
  sectionHead:{
      color:"white",
      fontSize:18,
      fontWeight:"bold",
  },
  cardView: {
    padding:0,
    width:'100%',
    height:'100%',
    flexDirection:"column",
    borderColor:"grey",
  },
  card:{
      backgroundColor:"#2E2435",
      borderRadius:15,
      margin:10 
  },
  cardImg:{
        height: 185,
        width: 155,
        borderRadius:15,
        flexGrow:1,
  },
  cardTitle:{ 
    padding:5,
    position: 'absolute',
    width:"100%",
    alignSelf:"flex-start",
    backgroundColor:'rgba(166,1,122,0.4)',
    borderTopLeftRadius:15,
    borderTopRightRadius:15
 },
  cardDate:{ 
    bottom:0,
    padding:5,
    position: 'absolute',
    alignSelf:"flex-start",
    backgroundColor:"#B6232A",
    borderBottomLeftRadius:15,
    borderTopRightRadius:15
 },
 image: {
    width: '100%',
    height: '100%',
 },
 sCard:{
    borderRadius:15,
    margin:10 
 },
 sCardImg:{
    height: 100,
    width: 155,
    borderRadius:15,
 },
 sCardTitle:{
    padding:5,
    width:"100%",
    alignSelf:"flex-start",
    borderTopLeftRadius:15,
    borderTopRightRadius:15
 },

});