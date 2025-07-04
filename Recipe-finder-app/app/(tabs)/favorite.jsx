import { View, Text, ScrollView, TouchableOpacity, Alert, FlatList, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useClerk, useUser } from '@clerk/clerk-expo'
import {API_URL} from "../../constants/api.js"
import {favoriteStyles} from "../../assets/styles/favorite.styles.js"
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/COLORS'
import RecipeCard from '@/Components/RecipeCard.jsx'
import NoFavoritesFound from '@/Components/NoFavoritesFound.jsx'
import LoadingSpinner from '@/Components/LoadingSpinner.jsx'
const FavoritesScreen = () => {
  const {signOut} = useClerk();//clerk package dependency
  const {user} = useUser();
  //to keep track of favorite recipes
  const [favoriteRecipes,setFavoriteRecipes] = useState([]);
  const [loading,setLoading]=useState(true);

 const handleSignout = () => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) signOut();
  } else {
    Alert.alert("Logout", "Are you sure you want to Logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  }
};
  useEffect(()=>{
    const loadFavorites=async()=>{
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);
        if(!response.ok) throw new Error("Failed to fecth favorites");

        const favorites = await response.json();

        //transform the data to match the RecipeCard Component's expected format 
        const transformedFavorites = favorites.map((favorite)=> ({
          ...favorite,
          id:favorite.recipeId
        }))
        setFavoriteRecipes(transformedFavorites);
        
      } catch (error) {
        console.log("Error loading favorites")
        Alert.alert("Error","Failed to load favorites");
      }finally{
        setLoading(false);
      }

    }
    loadFavorites();
  },[user.id])

  if(loading) return <LoadingSpinner message="Loading your favorites..."/>
  return (
    <View style={favoriteStyles.container}>
      <ScrollView
      showsVerticalScrollIndicator={false}>
        <View style={favoriteStyles.header}>
           <Text style={favoriteStyles.title}>Favorites</Text>
        <TouchableOpacity style={favoriteStyles.logoutButton}
        onPress={handleSignout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.text}/>
        </TouchableOpacity>
        </View>

        <View style={favoriteStyles.recipeSection}>
          <FlatList
          data={favoriteRecipes}
          renderItem={({item})=> <RecipeCard recipe={item}/>}
          keyExtractor={(item)=>item.id.toString()}
          numColumns={2}
          columnWrapperStyle={favoriteStyles.row}
          contentContainerStyle={favoriteStyles.recipeGrid} 
          scrollEnabled={false}
          ListEmptyComponent={<NoFavoritesFound/>}
          />

        </View>

      </ScrollView>
    </View>
  )
}

export default FavoritesScreen