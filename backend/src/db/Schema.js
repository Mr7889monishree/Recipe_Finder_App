import {pgTable,serial,text,timestamp,integer} from "drizzle-orm/pg-core";

//table name given as favoriteTable
export const favoriteTable=pgTable("favorites",{
    id:serial("id").primaryKey(), //serial - which means its going to be incremented by 1
    userId:text("user_id").notNull(),//text-going to be a type of text and it cannot be null as we need user id for authentication purpose.
    recipeId:integer("recipe_id").notNull(),
    title:text("title").notNull(),
    image:text("image"),
    cookTime:text("cook_time"),
    servings:text("servings"),
    createdAt:timestamp("created_at").defaultNow(),
})