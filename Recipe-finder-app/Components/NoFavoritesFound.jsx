import { useRouter } from "expo-router";
import {View,Text,TouchableOpacity} from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import { favoriteStyles } from "@/assets/styles/favorite.styles";


function NoFavoritesFound(){
    const router=useRouter();

    return(
        <View style={favoriteStyles.emptyState}>
            <View style={favoriteStyles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={20} color={COLORS.textLight}/>
            </View> 
            <Text style={favoriteStyles.emptyTitle}>No Favorites Yet</Text>
            <TouchableOpacity style={favoriteStyles.exploreButton}
            onPress={()=> router.push("/")}>
                <Ionicons name="search" size={18} color={COLORS.white}/>
                <Text style={favoriteStyles.exploreButtonText}>Explore Recipes</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NoFavoritesFound;