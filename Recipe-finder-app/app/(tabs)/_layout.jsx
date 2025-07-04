import { COLORS } from '@/constants/COLORS';
import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router'

const TabLyout = () => {
    const {isSignedIn,isLoaded} = useAuth();

    if(!isLoaded) return null; //this will directly take you to the home page if you have signed in well 
    if(!isSignedIn) return <Redirect href={"/(auth)/sign_in"}/>
  return (
    <Tabs
    screenOptions={{headerShown:false,
      tabBarActiveTintColor:COLORS.primary,
      tabBarInactiveTintColor:COLORS.textLight,
      tabBarStyle:{
        backgroundColor:COLORS.white,
        borderTopColor:COLORS.border,
        borderWidth:1,
        paddingBottom:8,
        paddingTop:8,
        height:80,
      },
      tabBarLabelStyle:{
        fontSize:16,
        fontWeight:"600",
      }
    }
  }
    >
      <Tabs.Screen
      name="index"
      options={{
        title:"Home",
        tabBarIcon:({color,size})=> <Ionicons name="restaurant" size={size} color={color}/>
      }}/>
      <Tabs.Screen
      name="search"
      options={{
        title:"Search",
        tabBarIcon:({color,size})=> <Ionicons name="search" size={size} color={color}/>
      }}/>
      <Tabs.Screen
      name="favorite"
      options={{
        title:"Favorites",
        tabBarIcon:({color,size})=> <Ionicons name="heart" size={size} color={color}/>
      }}/>
    </Tabs>
  )
}

export default TabLyout