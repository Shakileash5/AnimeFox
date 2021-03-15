import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native';
import { WebView as Webview } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export default function WebView({route,navigation}) {
  //"https://storage.googleapis.com/lexical-bit-302900/2WCIAXZVNC35/22a_1614272253152867.mp4"
  const [url,setUrl] = useState('');
  const navigation1 = useNavigation();
  function LoadingIndicatorView() {
    return <ActivityIndicator color='#009b88' size='large' />
  }
  //setUrl(route.params["urlParam"]);
  return (
      <Webview source={{ uri: route.params["urlParam"]||'https://gogo-play.net/streaming.php?id=MTUyODY3' }} 
        renderLoading={LoadingIndicatorView}
        style={{top:10}}
        startInLoadingState={true}
        onShouldStartLoadWithRequest ={false}/> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
