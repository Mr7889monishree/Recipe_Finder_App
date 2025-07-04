import { View, Text,Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo';
import {authStyles} from "../../assets/styles/auth.styles.js"
import {Image} from "expo-image"
import { COLORS } from '@/constants/COLORS.js';
import {Ionicons} from "@expo/vector-icons"
const SignInScreen = () => {
  const router = useRouter();
  const {signIn,setActive,isLoaded} = useSignIn();
  //to keep track of user details while signing in
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showpassword,setShowpassword]= useState(false);
  const [loading,setLoading]=useState(false);

  const handleSignIn=async()=>{
    //if user provided the email and password
    if(!email || !password){
      Alert.alert("Error","Please fill in all fields");
      return
    }
    if (!isLoaded) {
      console.warn("Sign-in not yet loaded");
      return;
}


    setLoading(true);
    try {
      const signInAttempt=await signIn.create({
        identifier:email,
        password,
      });

      if(signInAttempt.status==="complete"){
        await setActive({session:signInAttempt.createdSessionId});
      }
      else{
        Alert.alert("Error","Sign in failed.Please Try again!");
        console.error(JSON.stringify(signInAttempt,null,2));
        
      }
    } catch (error) {
      //if there is any message in error that will be displayed for that safety case of fallback only we have this ?. symbol where if there is no message in error the default text will be displayed
      Alert.alert("Error",error.errors?.[0]?.message || "Sign in failed");
      console.error(JSON.stringify(error,null,2));      
    }finally{
      setLoading(false);
    }
  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS==='ios'?"padding":"height"}
      keyboardVerticalOffset={Platform.OS==='ios' ? 64 : 0}>
        <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
          <View style={authStyles.imageContainer}>
            <Image
            source={require("../../assets/images/i1.png")}
            style={authStyles.image}
            contentFit="contain"
            />
          </View>
            <Text style={authStyles.title}>Welcome back</Text>
            {/**FORM CONTAINER */}
            <View style={authStyles.formContainer}>
              <View style={authStyles.inputContainer}>
              <TextInput
              placeholder='Enter your mail'
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              style={authStyles.textInput}
              keyboardType="email-address"
              autoCapitalize='none'
              />
              </View>
              <View style={authStyles.inputContainer}>
              <TextInput
              placeholder='Enter your password'
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              style={authStyles.textInput}
              secureTextEntry={!showpassword}
              autoCapitalize='none'
              />
              <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={()=>setShowpassword(!showpassword)}>
                <Ionicons
                name={showpassword ? "eye-outline":"eye-off-outline"}
                size={20}
                color={COLORS.textLight}
                />
              </TouchableOpacity>
              </View>
              
              <TouchableOpacity
              //if the page is loading then only the authstyles.buttonDisabled will take place other wise its normally authbutton only
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>{loading ? "Signing In...":"Sign In"}</Text>
              </TouchableOpacity>
              {/**Sign up Link */}
              <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={()=>  router.push("/(auth)/sign_up")}>
                <Text style={authStyles.linkText}>
                Don&apos;t have an account? <Text style={authStyles.link}>Sign Up</Text></Text>

              </TouchableOpacity>
            </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;