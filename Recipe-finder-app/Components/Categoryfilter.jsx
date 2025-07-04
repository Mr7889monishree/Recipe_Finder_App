import {View,Text,TouchableOpacity,ScrollView} from "react-native";
import { Image } from "expo-image";
import { homeStyles } from "@/assets/styles/home.styles";

export default function Categoryfilter({categories,selectedCategory,onSelectCategory}){
    return(
        <View style={homeStyles.categoryFilterContainer}>
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.categoryFilterScrollContent}>
                {categories.map((category)=>{
                    const isSelect = selectedCategory === category.name;
                    return (
                        <TouchableOpacity
                        key={category.id}
                        style={[homeStyles.categoryButton, isSelect && homeStyles.selectedCategory]}
                        onPress={()=> onSelectCategory(category.name)}
                        activeOpacity={0.7}
                        >
                            <Image
                            source={{uri:category.image}}
                            style={[homeStyles.categoryImage,isSelect && homeStyles.selectedCategoryImage]}
                            contentFit="cover"
                            transition={300}/>
                            <Text style={[homeStyles.categoryText, isSelect && homeStyles.selectedCategoryText]}>
                                {category.name}
                            </Text>

                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}