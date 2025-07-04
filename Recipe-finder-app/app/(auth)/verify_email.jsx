import { View, Text,KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/COLORS';


const VerifyEmail = ({email,onBack}) => {
  const route = useRouter();
  const {isLoaded,setActive,signUp}=useSignUp();
  const [code,setCode] = useState("");
  const [isloading,setIsloading] = useState(false);


  const handleVerification=async()=>{
    if(!isLoaded) return;

    setIsloading(true);
    try {
      const signUpAttempt=await signUp.attemptEmailAddressVerification({code});
      if(signUpAttempt.status==="complete"){
        await setActive({session:signUpAttempt.createdSessionId});
      }
      else{
        Alert.alert("Error","Verification Failed Please try again.");
        console.error(JSON.stringify(signUpAttempt,null,2));
      }
      
    } catch (err) {
      Alert.alert("Error",err.errors?.[0]?.message || "Sign Up failed");
      console.error(JSON.stringify(err,null,2));
      
    }finally{
      setIsloading(false);

    }

  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS==='ios'?"padding":"height"}
      keyboardVerticalOffset={Platform.OS==='ios'?64:0}>
        <ScrollView
        style={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
          <View style={authStyles.imageContainer}>
            <Image
            source={require("../../assets/images/i3.png")}
            style={authStyles.image}
             contentFit="contain"
              />
          </View>
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>{`We've sent a verification code to ${email}`}</Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
              placeholder='Enter the verification code'
              placeholderTextColor={COLORS.textLight}
              style={authStyles.textInput}
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
              autoCapitalize='none'
              />
            </View>
            <TouchableOpacity
            style={[authStyles.authButton, isloading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={isloading}
              activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>{isloading ? "Verifying.." :"Verify Email"}</Text>

            </TouchableOpacity>
            <TouchableOpacity
            style={authStyles.linkContainer} 
            onPress={onBack}>
              <Text style={authStyles.linkText}>
              <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmail