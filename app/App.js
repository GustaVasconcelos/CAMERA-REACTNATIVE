import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FaceDetector from 'expo-face-detector'
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
export default function App() {

     const [type, setType] = useState(CameraType.front);
     const [permission, requestPermission] = Camera.useCameraPermissions();
     const faceValues = useSharedValue({
          width:0,
          height:0,
          x:0,
          y:0
     })
     const [faceDetected, setFaceDetected] = useState(false)
     const handleFacesDetected = ({faces}) => {
          const face = faces[0]

          if(face){
               const {size,origin} = face.bounds
               faceValues.value = {
                    width:size.width,
                    height:size.height,
                    x:origin.x,
                    y:origin.y
               }
               setFaceDetected(true)
          }else{
               setFaceDetected(false)
          }
     }

     const animatedStyle = useAnimatedStyle(() =>({
          position:'absolute',
          zIndex:1,
          width:faceValues.value.width,
          height:faceValues.value.height,
          transform:[
               {translateX:faceValues.value.x},
               {translateY:faceValues.value.y}
          ],
          borderColor:'blue',
          borderWidth:10
     }))
     useEffect(() =>{
          requestPermission()
     },[permission]) 


     if(!permission?.granted){
          return
     }

  return (
    <View style={styles.container}>
     {faceDetected && 
          <Animated.View style={animatedStyle}/>
     }
      <Camera style={styles.camera} type={CameraType.front}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
               mode: FaceDetector.FaceDetectorMode.fast,
               detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
               runClassifications: FaceDetector.FaceDetectorClassifications.none,
               minDetectionInterval: 100,
               tracking: true,
          }}
      >

      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera:{
     width:'100%',
     height:'100%'
  }
});
