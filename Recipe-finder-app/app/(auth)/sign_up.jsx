import { View, Text,Alert, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/COLORS';
import VerifyEmail from './verify_email';

const SignUpScreen = () => {
  const router = useRouter();
  const {isLoaded,signUp} = useSignUp();
  const [email,setEmail]  = useState("");
  const [password,setPassword] = useState("");
  const [showpassword,setShowpassword]=useState(false);
  const [loading,setLoading]=useState(false);
  const [pendingVerification,setPendingVerification]=useState(false);

  const handleSignUp=async()=>{
    if(!email || !password){
      Alert.alert("Error","Please Fill in all fields");
      return;
    }
    if(password.length < 8){
      Alert.alert("Error","Password must be atleast 8 characters")
      return;
    }
    if(!isLoaded) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress:email,password}) //if the sign up is done successfully we will send a 6 digit pasword to the mail for verification before signing up and adding the user  

        await signUp.prepareEmailAddressVerification({strategy:"email_code"})
        setPendingVerification(true);
      
    } catch (error) {
      Alert.alert("Error",error.errors?.[0]?.message || "Failed to create the account");
      console.error(JSON.stringify(error,null,2));
      
    }finally{
      setLoading(false);
    }
  }
  if(pendingVerification){
    return <VerifyEmail email={email} onBack={()=> setPendingVerification(false)}/>
  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS==='ios'?64:0}>
        <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
          {/**image placement */}
          <View
          style={authStyles.imageContainer}>
            <Image
            source={require("../../assets/images/i2.png")}
            style={authStyles.image}
            contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}>Create Account</Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
              placeholder='Enter Mail'
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              style={authStyles.textInput}
              keyboardType='email-address'
              autoCapitalize='none'
              />
            </View>
            <View style={authStyles.inputContainer}>
              <TextInput
              placeholder='Enter password'
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showpassword}
              style={authStyles.textInput}
              autoCapitalize='none'
              />
              <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={()=>setShowpassword(!showpassword)}>
                <Ionicons
                name={showpassword ? "eye-outline" :"eye-off-outline"
                }
                size={20}
                color={COLORS.textLight}/>

              </TouchableOpacity>
            </View>
            <TouchableOpacity
                          //if the page is loading then only the authstyles.buttonDisabled will take place other wise its normally authbutton only
                          style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                          onPress={handleSignUp}
                          disabled={loading}
                          activeOpacity={0.8}
                          >
                            <Text style={authStyles.buttonText}>{loading ? "Creating Account...":"Sign Up"}</Text>
                          </TouchableOpacity>
                    <TouchableOpacity
                    style={authStyles.linkContainer} onPress={()=> router.back()}>
                      <Text style={authStyles.linkText}>
                        Already have an account? <Text style={authStyles.link}>Sign In</Text>
                      </Text> 

                    </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUpScreen