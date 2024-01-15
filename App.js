import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from './scr/components/Button';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [showTakePictureButton, setShowTakePictureButton] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        setImage(uri);
        setShowTakePictureButton(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.saveToLibraryAsync(image);
        alert('Picture saved!');
        setImage(null);
        setShowTakePictureButton(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const switchCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const retakePicture = () => {
    setImage(null);
    setShowTakePictureButton(true);
  };

  if (hasCameraPermission === false) {
    return <Text>No Access To Camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} type={type} flashMode={flash} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <Button icon="retweet" onPress={switchCamera} />
              <Button
                icon="flash"
                color={flash === Camera.Constants.FlashMode.off ? 'gray' : 'white'}
                onPress={toggleFlash}
              />
            </View>
          </Camera>
          {showTakePictureButton && (
            <Button title="take a picture" icon="camera" onPress={takePicture} />
          )}
        </View>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      {image ? (
        <View style={styles.buttonContainer}>
          <Button title="Re-take" icon="retweet" onPress={retakePicture} />
          <Button title="Save" icon="check" onPress={saveImage} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  camera: {
    flex: 1,
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
});