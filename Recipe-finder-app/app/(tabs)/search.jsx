import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MEALAPI } from '@/Services/mealAPI';
import {useDebounce} from '../../hooks/useDebounce.js'
import {searchStyles} from '../../assets/styles/search.styles.js'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/COLORS';
import RecipeCard from '@/Components/RecipeCard';
import LoadingSpinner from '@/Components/LoadingSpinner.jsx';
const SearchScreen = () => {
  const [searchQuery,setSearchQuery]=useState("");
  const [recipes,setRecipes]= useState([]);
  const [loading,setLoading] = useState(false);//this is when type something in search bar the ui will have loading state thats why we need two diiferent loading state
  const debouncedSearchQuery=useDebounce(searchQuery,300);//really useful for perfomance optimization as you can just send one request for one word instead of each request for each letter 
  const [initialLoading,setInitialLoading] = useState(true);//initially when you visit the file you will have the loading state 
  const performSearch = async(query)=>{
    //no search query is given and its empty means
    if(!query.trim()){
      const randomMeals= await MEALAPI.getRandomMeals(12);
      return randomMeals.map((meal)=> MEALAPI.transformMealData(meal)).filter((meal)=> meal!==null);
    }
    //if search by name
    const nameResults = await MEALAPI.searchMealsByname(query);
    let results = nameResults;

    // otherwise search by ingredient
    if(results.length===0){
      const ingredientResult= await MEALAPI.filterByIngredient(query);
      results=ingredientResult;
    }
    return results.slice(0,12).map((meal)=> MEALAPI.transformMealData(meal)).filter((meal)=> meal!==null);
  }

  useEffect(()=>{
    const LoadInitialData=async()=>{
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (error) {
        console.log("Error while initializing data",error);
      }finally{
        setInitialLoading(false);
      }
    }
    LoadInitialData();
  },[])

  useEffect(()=>{
    if(initialLoading) return ;
    const handleSearch=async()=>{
      setLoading(true);
      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.log("Error Searching:",error);
        setRecipes([]);
        
      }finally{
        setLoading(false);
      }
    }
    handleSearch();
  },[debouncedSearchQuery,initialLoading])


  if(initialLoading){
    return  <LoadingSpinner message="Loading recipes..."/>
  }
  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
          name="search"
          size={20}
          color={COLORS.textLight}
          style={searchStyles.searchIcon}/>

          <TextInput
          placeholder='Search recipes, ingredients...'
          placeholderTextColor={COLORS.textLight}
          style={searchStyles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={()=> setSearchQuery("")} 
            style={searchStyles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight}/>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>

        </View>
        {loading ? (
        <View style={searchStyles.loadingContainer}>
          <LoadingSpinner message="Searching recipes..." size="small"/>
        </View>
      ):(
        <FlatList
         data = {recipes}
         renderItem={({item})=> <RecipeCard recipe={item}/>}
         keyExtractor={(item)=> item.id.toString()}
         showsVerticalScrollIndicator={false}
         numColumns={2}
         columnWrapperStyle={searchStyles.row}
         contentContainerStyle={searchStyles.recipesGrid}
         ListEmptyComponent={<NoresultsFound/>}
        />
      )}
      </View>
      
    </View>
  )
}

export default SearchScreen

function NoresultsFound(){
  return(

    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight}/>
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try adjusting your search or try different keywords
      </Text>
    </View>
  )
}