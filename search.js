import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,ActivityIndicator,RefreshControl,Button,Image,SafeAreaView,ScrollView,TouchableOpacity  } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';


export default function Search(params,{navigation}){
  
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchText,setSearchText] = useState("one piece");
    const [isVisible,setVisible] = useState(false);
    const [results,setResults] = useState([]);
    const onChangeSearch = (query )=> {setSearchQuery(query);getResults();}
    const thumbnail = "https://cdnimg.xyz/images/anime/One-piece.jpg"
    const navigation1 = useNavigation();
    const userId = params.route.params.userId;
    const baseUrl = "https://serene-fortress-54214.herokuapp.com";//"http://127.0.0.1:5000";
    const animeUrl = "https://gogo-play.net/";


    const getResults = ()=>{
        setRefreshing(true);
        fetch(baseUrl+"/search_result?raw_link="+animeUrl+"search.html?keyword="+searchQuery)
        .then((response)=>{
            return response.json();
        }).then((response)=>{
            //console.log(response);
            let items = [];
            response["result"].map((obj,id)=>{
                let temp = obj;
                items.push(temp);
            })
            setResults(response["result"]);
            setRefreshing(false);
            //console.log(results);
        }).catch((exception)=>{
            setRefreshing(false);
        });
    }

    //console.log(results,"ew")
    const navigatePage = (data)=>{
        //console.log(data,navigation);
        let arr = data["href"].split("-");
        arr[arr.length-1]="1";
        let link = arr.join("-")
        let url = animeUrl+link.slice(1,link.length);
        navigation1.navigate('AnimePage',{urlParam:url,uid:userId});
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getResults();
        
    }, []); 

    return (
            <View style={styles.container}>
                <View  style={styles.header}> 
                    <Image  source={require('./static/anime_fox.png')}
                        style={{height: 30,
                                width: 160,
                                borderRadius:0,}}
                                resizeMode ="stretch"
                    />
                </View>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    onIconPress={onChangeSearch}
                    value={searchQuery}
                    iconColor={"grey"}
                    style={styles.searchBar}
                    inputStyle={styles.searchText}
                />
                <View style={{top:20}}>
                <Text style={{color:"grey",fontSize:18,fontWeight:"bold"}}> Search Results </Text>
                </View>
                <ScrollView contentContainerStyle={{alignItems:"center"}} style={{top:30}}  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    {
                        results.map((obj,id)=>{
                            return(
                                <TouchableOpacity key={id}
                                 style={{height:120,width:"95%",padding:5,elevation:4,margin:10,borderRadius:10,backgroundColor:"#23252F"}}
                                 onPress= {()=>{navigatePage(obj)}} > 
                                    <View style={{flexDirection:"row",width:350,height:200,padding:5}}>
                                        <Image 
                                            source={{uri:obj["pic_link"]||"https://cdnimg.xyz/cover/hunter-x-hunter-dub.png"}}
                                            style={styles.img}                 
                                        />
                                        <View style={{padding:10,width:230,left:"0%",alignItems:"stretch"}}>
                                            <Text adjustsFontSizeToFit={true} style={{textAlignVertical: "top",color:"white",fontSize:14,fontWeight:"bold"}}> {obj["description"].length>35?obj["description"][0]+obj["description"].slice(1,35)+"...":obj["description"]} </Text>
                                            <Text style={{color:"grey",fontSize:14,}}> {obj["date"].search("-")!=-1?obj["date"].slice(0,4):obj["date"]} </Text>
                                            
                                            <View style={obj["description"].search("Dub")!=-1?{backgroundColor:"#50B26B",borderRadius:5,width:50,height:20,justifyContent:"center",alignItems:"center",marginTop:5}:{backgroundColor:"#00A1FC",borderRadius:5,width:50,height:20,justifyContent:"center",alignItems:"center",marginTop:5}}>
                                                <Text style={{color:"white",fontSize:13,fontWeight:"bold"}}>{obj["description"].search("Dub")!=-1?"DUB":"SUB"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })    
                    }
                </ScrollView>
                

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