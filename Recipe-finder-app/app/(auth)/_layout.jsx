import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()//useAuth is a hook used in clerk to check if the user is signed in or not

  //if the user is signed in then take them to home page  
  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return<Stack screenOptions={{headerShown:false}}/>  
}