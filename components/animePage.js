import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,ActivityIndicator,RefreshControl,Button,Image,SafeAreaView,ScrollView,TouchableOpacity,YellowBox   } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import firebase from './firebase';
import "firebase/auth";
import "firebase/database";

export default function AnimePage({route,navigation}) {
    //https://api.jikan.moe/v3/search/anime?q=one%20piece
    //https://myanimelist.net//anime//21//One_Piece
    const [screenHeight,setScreenHeight] = useState(0);
    const [episodes,setEpisodes] = useState([]);
    const [totalEpis,setTotalEpis] = useState(0);
    const [description,setDescription] = useState('');
    const [iframe,setIframe] = useState('');
    const [mp4Link,setMp4Link] = useState('');
    const [name,setName] = useState('');
    const [thumbnail,setThumbnail] = useState('');
    const [mp4PlayerLink,setMp4PlayerLink] = useState('');
    const navigation1 = useNavigation();
    const [moreDesc,setMoreDesc] = useState(0);
    const [linkValid,setLinkValid] = useState(-1);
    const [currentEpisode,setCurrentEpisode] = useState('');
    const [isFavourite,setFavourite] = useState(0);
    const [loaclObj,setLoaclObj] = useState([]);
    const [refreshing, setRefreshing] = React.useState(true);
    var link = "";
    const desc = "";
    const height = 150;
    const baseUrl = "https://serene-fortress-54214.herokuapp.com";//"http://127.0.0.1:5000";
    const apiUrl = "https://gogo-play.net/";
    const [animeUrl,setAnimeUrl] = useState("https://gogo-play.net/videos/one-piece-episode-964");
    const highestTimeoutId = setTimeout(() => ';');
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i); 
    }
    
    //console.log(route.params) 

    const onContentSizeChange = (contentWidth, contentHeight) => {
        // Save the content height in state
        setScreenHeight(contentHeight );
    };

    useEffect(()=>{
        get_details();
    },[]);

    const onRefresh = ()=>{
        get_details();
    }

    const checkMp4 = ()=>{
        //console.log(link)
        fetch("https://"+link).then((response)=>{
            return response.json();
        }).then((response)=>{
            //console.log(response,response["source"][0]["type"]);
            if (response["source"][0]["type"] == "mp4"){
                setMp4PlayerLink(response["source"][0]["file"]);
                setLinkValid(1);
            }
            else{
                setLinkValid(0);
            }
        })
    }

    const navigatePage = (data)=>{
        //console.log(data,navigation);
        let url = apiUrl+data["href"].slice(1,data["href"].length);
        navigation1.push('AnimePage',{urlParam:url,uid:route.params["uid"]});
    }
    const navigateNext = ()=>{
        if(currentEpisode<=totalEpis){
            let url = route.params["urlParam"];
            url = url.split("-");
            
            url[url.length-1] = parseInt(currentEpisode)+1+"";
            url = url.join("-");
            navigation1.push('AnimePage',{urlParam:url,uid:route.params["uid"]});
        }    
    }
    
    const toHome = ()=>{
        navigation1.navigate('MyTabs',{userId:route.params["uid"]});
    }

    const navigatePlayer = ()=>{
        if(isFavourite==1){
            //const uid = "sN6kQOuXsRhmkBcpfGyvzoBnjZ02";//response.user.uid;
            //console.log("uid ::: ",uid);
            let temp_dict = {
                            name:name,
                            url:route.params["urlParam"],
                            description:description,
                            thumbnail:thumbnail,
                            episode:currentEpisode,
                            totalEpis:totalEpis,
                        }
            let items = loaclObj;
            items.map((obj,id)=>{
                if(obj["name"]==name){
                    obj["episode"] = currentEpisode;
                    obj["totalEpis"] = totalEpis;
                    obj["url"] = route.params["urlParam"];
                }
            });
            //console.log(items,"items")
            firebase
            .database().ref("User/"+route.params["uid"]).set({animeList:items})
            .catch(err =>{
                console.log("err",err); 
            });
            //console.log("update 00")
        }
        if(linkValid==1){
            navigation1.push('VideoStream',{urlParam:mp4PlayerLink});
        }
        else if(linkValid==0){
            navigation1.push('WebView',{urlParam:iframe});
        }      
    }

    const ripEpisodeNum = (link)=>{
        // link = "gogo-play.net/ajax.php?id=MTUyMjAz&title=Jujutsu+Kaisen+%28TV%29+%28Dub%29&typesub=SUB&sub=&cover=Y292ZXIvanVqdXRzdS1rYWlzZW4tdHYtZHViLnBuZw==&refer=https://gogo-play.net/videos/jujutsu-kaisen-tv-dub-episode-13";
        let temp_linkID = link.search("&refer=");
        if(temp_linkID!=-1){
            let temp_link = link.slice(temp_linkID+7,link.length);
            temp_linkID = link.search("episode-");
            if(temp_linkID!=-1){
                temp_link = link.slice(temp_linkID+8,link.length);
                //console.log(temp_link,"episode\n");
                setCurrentEpisode(temp_link);
            }
        }
    }

    const get_details = ()=>{
        setRefreshing(true);
        if(route.params["urlParam"].length!=0){
            setAnimeUrl(route.params["urlParam"])
        }
        fetch(baseUrl+"/get_frame?raw_link="+route.params["urlParam"])
        .then((response)=>{
            //console.log("response",response)
            return response.json();
        })
        .then((response)=>{
           // console.log(JSON.stringify(response));
            let anime_desc = response["in_this_frame"];
            //console.log(anime_desc)
            setDescription(anime_desc["epi_description"]);

            //console.log(descripton,"desc",anime_desc["epi_description"]);
            setName(anime_desc["episode_name"]);
            setIframe(anime_desc["frame_link"]);
            setMp4Link(response["mp4"]);
            ripEpisodeNum(response["mp4"]);
            //console.log(response["mp4"])
            link = response["mp4"];

            let episodes_temp = response["below_episodes"];
            let items = []
            let temp = {}
            Object.keys(episodes_temp).map((key,id)=>{
                temp = episodes_temp[key];
                temp["Episode_name"] = key;
                items.push(temp);
            });
            //items.sortBy("Episode_name");
            setEpisodes(items);
            setTotalEpis(items.length)
            setThumbnail(temp["pic_link"]);
            if(response["cover_pic"]!=404){
                setThumbnail(response["cover_pic"]);
            }
            //console.log(episodes,temp);
            fetchFavourite(anime_desc["episode_name"]);
            checkMp4();
            setRefreshing(false);
            
        }).catch((exception)=>{
            setRefreshing(false);
        });
    }

    const fetchFavourite = (animeName)=>{
        try{
                //const uid = "sN6kQOuXsRhmkBcpfGyvzoBnjZ02";//response.user.uid;
                //console.log("uid ::: ",uid);
                firebase.database().ref("User/"+route.params["uid"]).once("value",function(animeList){
                    
                    
                    //console.log("animes",animeList,animeList.val);
                    if (animeList.val()!=null){
                        let animes = animeList.val()["animeList"];
                        animes.map((obj,id)=>{
                            //console.log(obj,obj["name"]==animeName,obj["name"],animeName);
                            if(obj["name"]==animeName){
                                setFavourite(1);
                                console.log("updated here ap")
                            }
                            
                        });
                        setLoaclObj(animes);

                        }
                        
                    }

                    
                ).catch((error)=>{
                    //console.log(exceperrortion);
                });
            }
            catch(exception){
                //console.log(exception);
            }
    }

    const addFavourite = ()=>{
        try{
                //const uid = "sN6kQOuXsRhmkBcpfGyvzoBnjZ02";//response.user.uid;
                //console.log("uid ::: ",uid);
                
                    
                    
                    //console.log(loaclObj)
                    if (isFavourite==0 && loaclObj.length==0){
                        let temp_dict = {
                            name:name,
                            url:route.params["urlParam"],
                            description:description,
                            thumbnail:thumbnail,
                            episode:0,
                            totalEpis:totalEpis,
                        }
                        firebase
                        .database().ref("User/"+route.params["uid"]).set({animeList:[temp_dict]})
                        .catch(err =>{
                            console.log("err",err); 
                        });
                        //console.log("update 00")
                        setFavourite(1);
                    }
                    else if(isFavourite==0){
                        let temp_dict = {
                            name:name,
                            url:route.params["urlParam"],
                            description:description,
                            thumbnail:thumbnail,
                            episode:0,
                            totalEpis:totalEpis,
                        }
                        let items = loaclObj;
                        items.push(temp_dict);
                        setLoaclObj(items);
                        firebase
                        .database().ref("User/"+route.params["uid"]).set({animeList:items})
                        .catch(err =>{
                            console.log("err",err); 
                        });
                        //console.log("update 01")
                        setFavourite(1);
                    }
                    else if(isFavourite==1){
                        let idx = -1;
                        let items = loaclObj;
                        loaclObj.map((obj,id)=>{
                        if(obj["name"]==name)
                        {
                            items.splice(id,1);
                        }
                        });
                        firebase
                        .database().ref("User/"+route.params["uid"]).set({animeList:items})
                        .catch(err =>{
                            //console.log("err",err); 
                        });
                        setFavourite(0);

                    }

            }
            catch(exception){
                console.log(exception);
            }
                    /*firebase
                .database().ref("User/"+uid).set({})
                .catch(err =>{
                    console.log("err",err); 
                });*/
    }
    const [hei,setHei]=useState("100%");

    const scrollEnabled = screenHeight > height;
    return (
            
            <SafeAreaView  style={styles.container}>

                <ScrollView scrollEnabled={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    <View 
                        style={{marginBottom:10,elevation: 10}}>
                        <Image 
                            source={thumbnail?{uri:thumbnail}:require('./static/Jvjz.gif')}
                            style={styles.img}               
                        />
                        <IconButton
                                            icon={"arrow-left"}
                                            style={{color:"red",position:"absolute",left:10,top:20}}
                                            color={Colors.white}
                                            size={20}
                                            onPress={() => {toHome()}}
                                        />
                        <TouchableOpacity style={styles.playButton} onPress={()=>{navigatePlayer()}}>
                        <View >
                            <IconButton
                                icon="play"
                                style={{color:"red"}}
                                color={linkValid!=-1?Colors.white:Colors.grey600}
                                size={20}
                                onPress={()=>{navigatePlayer()}}
                            />
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.AddButton} onPress={()=>{addFavourite()}}>
                        <View >
                            <IconButton
                                icon="heart"
                                color={isFavourite==0?Colors.white:Colors.red500}
                                size={25}
                                onPress={()=>{addFavourite()}}
                            />
                        </View>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={{width:"100%",marginTop:15,padding:10,}}>
                        <Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> {name} </Text>
                        <View style={{flexDirection:"row",flex:1,alignItems:"center",marginTop:5,marginBottom:5}}>
                            <Text style={{color:"grey",fontSize:14,fontWeight:"bold"}}> { episodes.length!=1? "Episode: "+currentEpisode:''} </Text>
                            <View style={name.search("Dub")!=-1?{backgroundColor:"#50B26B",borderRadius:5,width:50,height:20,justifyContent:"center",alignItems:"center",margin:5}:{backgroundColor:"#00A1FC",borderRadius:5,width:50,height:20,justifyContent:"center",alignItems:"center",margin:5}}>
                                <Text style={{color:"white",fontSize:13,fontWeight:"bold"}}>{name.search("Dub")!=-1?"DUB":"SUB"}</Text>
                            </View>
                            <TouchableOpacity style={{margin:5,}} 
                                onPress={()=>{navigateNext()}} >
                                    <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#4EAFA6",height:20,width:80,borderRadius:4}}>
                                        <IconButton
                                            icon={"arrow-right"}
                                            style={{color:"red"}}
                                            color={Colors.white}
                                            size={10}
                                            onPress={() => {}}
                                        />
                                        <Text style={{color:"white",fontSize:13,top:-2,left:-5}}> { "Next"} </Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View
                            style={{ flex:1,height:hei,paddingTop:3,flexGrow:1,margin:2,alignItems:"flex-start" }}
                            >
                            
                                <Text style={{color:"grey",fontSize:13,padding:3}}>{ (moreDesc==0)?description.length>350?description.slice(0,350)+"...":description:description}</Text>
                                {description.length>350?
                                <TouchableOpacity style={{margin:5,}} 
                                onPress={()=>{setMoreDesc(!moreDesc);}} >
                                    <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#5A2E98",height:20,width:80,borderRadius:4}}>
                                        <IconButton
                                            icon={moreDesc==0?"plus":"minus"}
                                            style={{color:"red"}}
                                            color={Colors.grey600}
                                            size={10}
                                            onPress={() => {}}
                                        />
                                        <Text style={{color:"grey",fontSize:13,top:-2,left:-5}}> { moreDesc==0?"More":"less"} </Text>
                                    </View>
                                </TouchableOpacity>
                                :null}
                                
                        </View>
                    </View>
                    
                    <View style={{width:"100%",marginTop:0,padding:3}}>
                        <Text style={{color:"white",fontSize:15,fontWeight:"bold",marginTop:8,marginBottom:10}}> Episodes {totalEpis}</Text> 
                        <ScrollView contentContainerStyle={{flexGrow:1}} style={{padding:0,}} scrollEnabled={true} showsVerticalScrollIndicator={false}>
                            {
                                episodes.map((epi,id)=>{
                                    return(
                                            <TouchableOpacity key={id} onPress={()=>{navigatePage(epi)}}>
                                                <View key={id} style={{flex:1,flexDirection:"row",elevation:10,padding:15}}>
                                                    <View style={{width:120}}>
                                                        <Image
                                                            source={{uri:epi["pic_link"]||require('./static/Jvjz.gif')}}
                                                            style={styles.cardImg}
                                                        />
                                                        <View style={styles.playButtonSmall}>
                                                            <IconButton
                                                                icon="play"
                                                                color={Colors.white}
                                                                size={20}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={{padding:10,left:40,flexDirection:"column",justifyContent:"center"}}>
                                                        <Text style={{color:"white",fontSize:13,fontWeight:"bold",paddingLeft:5}}>{epi["Episode_name"].length>24?epi["Episode_name"].substring(0,24)+"...\n"+epi["Episode_name"].substring(epi["Episode_name"].search("Episode"),epi["Episode_name"].length):epi["Episode_name"]}</Text>
                                                        <Text style={{color:"grey",fontSize:13,}}> {epi["date"].search(":")==-1?(epi["date"]).replace("ago","").replace("hours","hrs"):epi["date"].slice(0,10)} </Text>  
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    )
                                })
                                
                            }          
                        </ScrollView>
                    </View>
                </ScrollView>
            </SafeAreaView >
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#191C22',
    },
    img:{
        flex:1, 
        height: 300, 
        width: "100%",
        alignSelf: 'stretch',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        zIndex:0,
    },
    playButton:{
        backgroundColor:"#52DBEC",
        padding:5,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:70,
        width:55,
        height:55,
        zIndex:5,
        position:"absolute",
        alignSelf:"center",
        top:"50%"
    },
    AddButton:{
        backgroundColor:"#7964E5",
        padding:5,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:70,
        width:50,
        height:50,
        zIndex:5,
        position:"absolute",
        alignSelf:"flex-end",
        bottom:"-10%",
        right:"10%"
    },
    cardImg:{
        height: 100,
        width: 155,
        borderRadius:15,
        flexGrow:1,
    },
    playButtonSmall:{
        backgroundColor:"purple",
        padding:1,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:50,
        width:30,
        height:30,
        position:"absolute",
        alignSelf:"flex-end",
        bottom:"-15%",
        right:"-15%"
    },
});