import { View,Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MEALAPI } from '../../Services/mealAPI.js';
import { homeStyles } from "../../assets/styles/home.styles.js";
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/COLORS.js';
import Categoryfilter from '../../Components/Categoryfilter.jsx';
import RecipeCard from '@/Components/RecipeCard.jsx';
import LoadingSpinner from '@/Components/LoadingSpinner.jsx';


//ttconst sleep = (ms) => new Promise(resolve =>setTimeout(()=> resolve(),ms));
const Index = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MEALAPI.getCategories(),
        MEALAPI.getRandomMeals(12),
        MEALAPI.getRandomMeal(),
      ]);

      const transformedCategory = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));
      setCategories(transformedCategory);
      if(!selectedCategory) setSelectedCategory(transformedCategory[0].name);

      const transformedMeals = randomMeals
        .map(meal => MEALAPI.transformMealData(meal)) // ✅ fixed typo from `transformedMealData`
        .filter(meal => meal !== null);
      setRecipes(transformedMeals);

      const transformFeaturedMeal = MEALAPI.transformMealData(featuredMeal); // ✅ fixed typo
      setFeaturedRecipe(transformFeaturedMeal);

    } catch (error) {
      console.log("Error loading the data", error);
    } finally {
      setLoading(false);
    }
  };

  // Load category-specific meals
  const loadCategoryData = async (category) => {
    try {
      const meals = await MEALAPI.fetchDatadependingOncategory(category);
      const transformedMeal = meals
        .map(meal => MEALAPI.transformMealData(meal))
        .filter(meal => meal !== null);
      setRecipes(transformedMeal);
    } catch (error) {
      console.log("Error in loading categorical data", error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const onRefresh=async()=>{
    setRefreshing(true);
    //await sleep(2000);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if(loading && !refreshing) return <LoadingSpinner message="Loading delicious recipes.."/>
  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // refreshControl to be added laterwhich is a component in react native used to add a pull-to-refresh functionality in scroll view,flatlist(perfomance optimixation component used for displaying large list of data) and  a small spinner action will take place when refreshing the page

        refreshControl={
          <RefreshControl
          refreshing={refreshing} //a boolean state to check whether the spinner is visible or not if false means spinner will not be visible the loading effect will not occur 
          onRefresh={onRefresh} //function that will triggered when the user perfoms the push to pull refresh action
          tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Animal Icons */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{ width: 100, height: 100 }}
          />
          <Image
            source={require("../../assets/images/chicken.png")}
            style={{ width: 100, height: 100 }}
          />
          <Image
            source={require("../../assets/images/pork.png")}
            style={{ width: 100, height: 100 }}
          />
        </View>

        {/* Featured Section */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
              <View style={homeStyles.featuredOverlay}>
                <View style={homeStyles.featuredBadge}>
                  <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                </View>
              <View style={homeStyles.featuredContent}>
                <Text style={homeStyles.featuredTitle} numberOfLines={2}>{featuredRecipe.title}
                </Text>
                <View style={homeStyles.featuredMeta}>
                  <View style={homeStyles.metaItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.white}/>
                    <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                  </View> 
                  <View style={homeStyles.metaItem}>
                    <Ionicons name="people-outline" size={16} color={COLORS.white}/>
                    <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                  </View>
                  {featuredRecipe.area && (
                    <View style={homeStyles.metaItem}>
                      <Ionicons name="location-outline" size={16} color={COLORS.white}/>
                      <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                    </View>
                  )}
                </View>
                </View>
              </View>
              </View>
            </TouchableOpacity>
          </View>
        )}


        {categories.length> 0 && (
          <Categoryfilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory = {handleCategorySelect}/>
        )}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>
            <FlatList
            data={recipes}
            renderItem={({item})=><RecipeCard recipe={item}/>}
            keyExtractor={(item)=> item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<View style={homeStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight}/>
              <Text style={homeStyles.emptyTitle}>No recipes Found</Text>
              <Text style={homeStyles.emptyDescription}>Try a Different Category</Text>
            </View>}/>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
