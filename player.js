import { StatusBar } from 'expo-status-bar';
import React,{useEffect} from 'react';
import { StyleSheet, Text, View,ActivityIndicator,Button } from 'react-native';
//import Video from 'react-native-video';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

//import { Video } from 'expo';

export default function VideoStream({route,navigation}) {
  //"https://storage.googleapis.com/lexical-bit-302900/2WCIAXZVNC35/22a_1614272253152867.mp4"
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const navigation1 = useNavigation();
  return (
      <View style={styles.container}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: route.params["urlParam"] || 'https://storage.googleapis.com/symmetric-index-304006/Z56OP_MKZMT4/22a_1614576212153531.mp4',
          }}
          useNativeControls
          resizeMode="contain"
          shouldPlay={1}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: "100%",
    height: "100%",
    backgroundColor:"#23252F",
  },
});