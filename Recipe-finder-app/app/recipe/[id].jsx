import { View, Text, ScrollView, TouchableOpacity,Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo';
import { API_URL } from '@/constants/api.js';
import { MEALAPI } from '@/Services/mealAPI';
import LoadingSpinner from '@/Components/LoadingSpinner';
import {recipeDetailStyles} from "../../assets/styles/recipe-details.styles"
import { Image } from 'expo-image';
import {LinearGradient} from "expo-linear-gradient"
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/COLORS';
import {WebView} from "react-native-webview"
const RecipeDetailScreen = () => {
    const router = useRouter();
    //for dynamic routing screens the file name should be inside the [] square bracket only 
    //while destructuring anything from useloacalsearchparams() we need to have the same name as the file name for dynamic routing to be possible  like if the file name is id then then desctructure name should also be id
    const {id:recipeId} = useLocalSearchParams();
    const [recipe,setRecipe] = useState(null);
    const [loading,setLoading]=useState(true);
    const [isSaved,setIsSaved] = useState(false);
    const [isSaving,setIsSaving]=useState(false);
    const {user}=useUser();
    const userId = user?.id;

    useEffect(()=>{
        const CheckIfSaved=async()=>{
            try {
                const response = await fetch(`${API_URL}/favorites/${userId}`);
                const favorites = await response.json();

                const isRecipeSaved = favorites.some((fav)=> fav.recipeId === parseInt(recipeId));
                setIsSaved(isRecipeSaved); 
            } catch (error) {
                console.log("Error checking if recipe is saved:",error);
            }
        };
        const loadRecipeDetails=async()=>{
            try {
                setLoading(true);
                const mealData = await MEALAPI.getMealbyId(recipeId);

                if(mealData){
                    const transformRecipe=MEALAPI.transformMealData(mealData);

                    const recipeWithvideo= {
                        ...transformRecipe,
                        youtubeUrl:mealData.strYoutube || null,
                    };
                    setRecipe(recipeWithvideo);
                }
            } catch (error) {
                console.log("Error loading recipe details",error);
            }finally{
                setLoading(false);
            }
        }
         if (recipeId && userId) {
            CheckIfSaved();
            loadRecipeDetails();
  }
    },[recipeId,userId])
    

    const getYoutubeUrl=(url)=>{
        const videoId = url.split("v=")[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    const handleToggleSave=async()=>{
      setIsSaving(true);
      try {
        if(isSaved){
            const response = await fetch(`${API_URL}/favorites/${userId}/${recipeId}`,{
                method:"DELETE",
            });
            if(!response.ok) throw new Error("Failed to remove recipe");
            setIsSaved(false);
        }
        else{
            //add to favorites
            const response = await fetch(`${API_URL}/favorites`,{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({
                    userId,
                    recipeId:parseInt(recipeId),
                    title:recipe.title,
                    image:recipe.image,
                    cookTime:recipe.cookTime,
                    servings:recipe.servings,
                })
            }); 
            if(!response.ok) throw new Error("Failed to save recipe");
            setIsSaved(true);
        }
        
        
      } catch (error) {
        console.log("Error while saving the data:",error);
        Alert.alert("Error","Something went wrong,please try again.");
      } finally{
        setIsSaving(false)
      }
    }
    const handleGoBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/'); // or router.push('/home') or any screen you want
  }
};

    if(loading) return <LoadingSpinner message="Loading the recipe details"/>
  return (
    <View style={recipeDetailStyles.container}>
        <ScrollView>
            <View style={recipeDetailStyles.headerContainer}>
                <View style={recipeDetailStyles.imageContainer}>
                    <Image
                    source={{uri:recipe.image}}
                    style={recipeDetailStyles.headerImage}
                    contentFit='cover'
                    />
                </View>
                <LinearGradient colors={["transparent","rgba(0,0,0,0.5)","rgba(0,0,0,0.8)"]}
                style={recipeDetailStyles.gradientOverlay}/>

                <View style={recipeDetailStyles.floatingButtons}>
                    <TouchableOpacity
                    style={recipeDetailStyles.floatingButton}
                    onPress={handleGoBack}>
                        <Ionicons name="arrow-back" size={24} 
                        color={COLORS.white}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[recipeDetailStyles.floatingButton,
                        {backgroundColor:isSaving ? COLORS.gray:COLORS.primary}
                    ]}
                    onPress={handleToggleSave}
                    disabled={isSaving} //this will be disabled fi we are in loading state
                    >
                        <Ionicons name={isSaving ? "hourglass" :isSaved ? "bookmark":"bookmark-outline"} size={24} 
                        color={COLORS.white}/>
                    </TouchableOpacity>

                </View>
                {/**Title Section for each recipe card */}
                <View style={recipeDetailStyles.titleSection}>
                    <View style={recipeDetailStyles.categoryBadge}>
                        <Text style={recipeDetailStyles.categoryText}>
                            {recipe.category}
                        </Text>
                    </View>
                    <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
                    {recipe.area && (
                        <View style={recipeDetailStyles.locationRow}>
                            <Ionicons name="location" size={16} color={COLORS.white}/>
                            <Text style={recipeDetailStyles.locationText}>{recipe.area} Cuisine</Text>
                        </View>
                    )}
                </View>
            </View>
             <View style={recipeDetailStyles.contentSection}>
                    {/**QUICK STATS */}
                    <View style={recipeDetailStyles.statsContainer}>
                        <View style={recipeDetailStyles.statCard}>
                            <LinearGradient
                            colors={["#FF6B6B","#FF8E53"]}
                            style={recipeDetailStyles.statIconContainer}>
                                 <Ionicons name="time" size={20} color={COLORS.white}/></LinearGradient>     
                                 <Text style={recipeDetailStyles.statValue}>{recipe.cookTime}</Text>     
                                 <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>                 
                        </View>
                        <View style={recipeDetailStyles.statCard}>
                            <LinearGradient
                            style={recipeDetailStyles.statIconContainer}
                            colors={["#4ECDC4","#44A08D"]}
                            >
                                <Ionicons name="people" size={20} color={COLORS.white}/>
                            </LinearGradient>
                            <Text style={recipeDetailStyles.statValue}>
                                {recipe.servings}
                            </Text>
                            <Text style={recipeDetailStyles.statLabel}>
                                Servings
                            </Text>
                        </View>
                    </View>
                    {/**YOUTUBE VIDEO */}
                    {recipe.youtubeUrl && (
                        <View style={recipeDetailStyles.sectionContainer}>
                            <View style={recipeDetailStyles.sectionTitleRow}>
                                <LinearGradient
                                colors={["#FF0000","#CC0000"]}
                                style={recipeDetailStyles.sectionIcon}
                                >
                                    <Ionicons name="play" size={16} color={COLORS.white}/>
                                </LinearGradient>
                                <Text style={recipeDetailStyles.sectionTitle}>Video Tutorial</Text>
                            </View>
                            {/**YOUTUBE VIDEO WILL APPEAR HERE */}
                            <View style={recipeDetailStyles.videoCard}>
                                <WebView
                                style={recipeDetailStyles.webview}
                                source={{uri:getYoutubeUrl(recipe.youtubeUrl)}}
                                allowsFullscreenVideo
                                mediaPlaybackRequiresUserAction={false}
                                />
                            </View>
                        </View>
                    )}
                    {/**INGREDIENTS SECTION */}
                    <View style={recipeDetailStyles.sectionContainer}>
                        <View style={recipeDetailStyles.sectionTitleRow}>
                            <LinearGradient
                            style={recipeDetailStyles.sectionIcon}
                            colors={[COLORS.primary,COLORS.primary+"80"]}
                            >
                                <Ionicons name="list" size={16} color={COLORS.white}/>
                            </LinearGradient>
                            <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
                            <View style={recipeDetailStyles.countBadge}>
                                <Text style={recipeDetailStyles.countText}>{recipe.ingredients ? recipe.ingredients.length:0}</Text>
                            </View>
                    </View>
                    {/**INGREDIENTS LIST */}
                    <View style={recipeDetailStyles.ingredientsGrid}>
                        {recipe.ingredients.map((ingredient,index)=>(
                             <View key={index} style={recipeDetailStyles.ingredientCard}>
                                <View style={recipeDetailStyles.ingredientNumber}>
                                <Text style={recipeDetailStyles.ingredientNumberText}>{index+1}</Text>
                            </View>
                            <Text style={recipeDetailStyles.ingredientText}>{ingredient}</Text>
                            <View style={recipeDetailStyles.ingredientCheck}>
                                <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.textLight}/>
                            </View>
                            </View>

                        ))}
                    </View>
                    </View>
                    {/**INSTRUCTION SECTION */}
                    <View style={recipeDetailStyles.sectionContainer}>
                        <View style={recipeDetailStyles.sectionTitleRow}>
                            <LinearGradient
                            style={recipeDetailStyles.sectionIcon}
                            colors={[COLORS.primary,COLORS.primary+"80"]}
                            >
                                <Ionicons name="list" size={16} color={COLORS.white}/>
                            </LinearGradient>
                            <Text style={recipeDetailStyles.sectionTitle}>Instruction</Text>
                            <View style={recipeDetailStyles.countBadge}>
                                <Text style={recipeDetailStyles.countText}>{recipe.instructions ? recipe.instructions.length : 0}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={recipeDetailStyles.instructionsContainer}>
                        {recipe.instructions.map((instruction,index)=>(
                            <View key={index} style={recipeDetailStyles.instructionCard}>
                                    <LinearGradient
                                    style={recipeDetailStyles.stepIndicator}
                                    colors={[COLORS.primary,COLORS.primary+"CC"]}
                                    >
                                        <Text style={recipeDetailStyles.stepNumber}>{index+1}</Text>

                                    </LinearGradient>
                                    <View style={recipeDetailStyles.instructionContent}>
                                        <Text style={recipeDetailStyles.instructionText}>{instruction}</Text>
                                        <View style={recipeDetailStyles.instructionFooter}>
                                            <Text style={recipeDetailStyles.stepLabel}>{`Step ${index+1}`}</Text>
                                                <TouchableOpacity style={recipeDetailStyles.completeButton}>
                                                    <Ionicons name="checkmark" size={16} color={COLORS.textLight}/>
                                                </TouchableOpacity>
                                        </View>
                                    </View>
           
                                </View>
                               
                        ))}
                    </View>
                    <TouchableOpacity
                    style={recipeDetailStyles.primaryButton}
                    onPress={handleToggleSave}
                    disabled={isSaving}>
                        <LinearGradient
                        colors={[COLORS.primary,COLORS.primary+"CC"]}
                        style={recipeDetailStyles.buttonGradient}
                        >
                            <Ionicons name="heart" size={20} color={COLORS.white}/>
                        <Text style={recipeDetailStyles.buttonText}>
                            {isSaved ? "Remove from Favorites":"Add to Favorites"}
                        </Text>
                        </LinearGradient>
                    </TouchableOpacity>
            </View> 

        </ScrollView>
    </View>
  ) 
}

export default RecipeDetailScreen
