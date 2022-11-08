import React, { useEffect, useState, } from 'react';
//step 2 delete AsyncStorage
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import  Navigation from './components/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/OnboardingScreen';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AppStack = createNativeStackNavigator();
const App = () =>{
  const [isFirstLaunch, setFirstLaunch] = React.useState(true);
  const [isLoggedIn,setIsLoggedIn] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [homeTodayScore, setHomeTodayScore] = React.useState(0);
  const [tempCode , setTempCode] = React.useState(null);
  //useEffect does special effects before the app loads (the behind the scenes)
  //step 3 (two const lines and getSessionToken, reload app and look for token from storage on the terminal)
  useEffect(()=>{
  //initializing the variable in order to store it
  const getSessionToken = async() => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    console.log('token from storage', sessionToken);
    //step 4 add validateResponse to get the email adress
    const validateResponse = await fetch('https://dev.stedi.me/validate/' + sessionToken);
    //token is valid if it is 200
    if(validateResponse.status == 200){
      const userEmail = await validateResponse.text();
      await AsyncStorage.setItem('userName',userEmail);
      console.log('userEmail', userEmail);
      setIsLoggedIn(true);
    }
    }
    getSessionToken();
  },[])
  //if they haven't loggen in yet they are directed to OnboardingScreen
   if (isFirstLaunch == true &&! isLoggedIn){
return(
  <OnboardingScreen setFirstLaunch={setFirstLaunch}/>
);
  }else if(isLoggedIn){
    return <Navigation/>
  } else{
    return (
      <View>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          placeholderTextColor='#4251F5'
          placeholder='Cell Phone'>
        </TextInput>
        <Button
          title='Send'
          style={styles.button}
          onPress={async()=>{
            console.log('Button was pressed')
            const sendTextResponce = await fetch(
              'https://dev.stedi.me/twofactorlogin/'+ phoneNumber,
              {
                method: 'POST',
                headers:{
                  'content-type' : 'application/text'
                }
              }
            )
            if (sendTextResponce.status!=200){
              console.log('Server send text responce: '+sendTextResponce.status)
              alert('communication error','Server responded to send text with status: '+sendTextResponce.status);
            }
          }}
        />
        <TextInput
        value={tempCode}
        onChangeText={setTempCode}
          style={styles.input}
          placeholderTextColor='#4251F5'
          placeholder='Enter Code'>
        </TextInput>
        <Button
          title='Verify'
          style={styles.button}
          onPress={async()=>{
            console.log('Button 2 was pressed')
            const loginResponse=await fetch(
              'https://dev.stedi.me/twofactorlogin',
              {
                method: 'POST',
                headers:{
                  'content-type' : 'application/text'
                },
                body:JSON.stringify({
                  phoneNumber,
                  oneTimePassword:tempCode
               })
              }
            )
              console.log(loginResponse.status)
              if(loginResponse.status == 200){
                const sessionToken = await loginResponse.text();
                await AsyncStorage.setItem('sessionToken', sessionToken)
                console.log('session token', sessionToken);
                //add this line to save token onto the hard drive of the phone
                //we want this app to only make you log in once and then it will store the data and always log you in automatically
                //step 1
                setIsLoggedIn(true);
              }
              else{
                console.log("token resonce Status",loginResponse.status)
                Alert.alert('Warning' , 'An invalid Code was entered')
              }
          }}
        />
      </View>
    )
  }
}
 export default App;
 const styles = StyleSheet.create({
     container:{
         flex:1,
         alignItems:'center',
         justifyContent: 'center'
     },
     input: {
       height: 40,
       margin: 12,
       borderWidth: 1,
       padding: 10,
       marginTop:200
     },
     input2: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      marginTop:300
    },
     margin:{
       marginTop:100
     },
     button: {
       alignItems: "center",
       backgroundColor: "#DDDDDD",
       padding: 10
     }
 })