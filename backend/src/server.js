//to prevent this error of the import and export we have to give the type as module in the package.json file of our backend so that we can prevent this error otherwise we have to call express like this: const app=require("express");
import express from "express";
import { ENV } from "./config/env.js";
import {db} from "./config/db.js";
import { favoriteTable } from "./db/Schema.js";
import { and,eq} from "drizzle-orm";
import job from "./config/cron.js";
import cors from "cors"


const app = express();
app.use(cors({
    origin: "*", // or "*" during testing
    credentials: true
}))
const PORT= ENV.PORT || 5000;
if(ENV.NODE_ENV==='production') job.start();//will send request every 14 mins only when the nod environment is in the production side

app.use(express.json()) // if you dont give this all the details fecthed in req.body will be undefined in value like how for dotenv it will be undefined if we dont import dotenv/config dependency in the server
app.get('/',(req,res)=>{
    res.send("Welcome");
})
app.get("/api/health",(req,res)=>{
    res.status(200).json({success:true});
})

//first endpoint to add a recipe to the app
app.post("/api/favorites",async(req,res)=>{
    try {
        //in try we can couple of different fields like:recipe id,title,image,cooking time,servings so that we know all these fields and save it to the database(neon database)
        const {userId,recipeId,title,image,cookTime,servings}=req.body;

        if(!userId || !recipeId || !title){
            res.status(400).json({error:"Missing required fields"});
        }
        const newFavorite = await db.insert(favoriteTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();//if you dont give anything in returning then it will return all values in favorite table

        //201-something new is being created
        res.status(201).json(newFavorite[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"Internal Error"});
        
    }

})
//delete the favorites
app.delete("/api/favorites/:userId/:recipeId", async(req,res)=>{
    try {
        const {userId,recipeId} = req.params;

        await db.delete(favoriteTable).where(
            and(
                eq(favoriteTable.userId,userId),
                eq(favoriteTable.recipeId,parseInt(recipeId))
            )
        );
        
        res.status(200).json({message:"Favorite removed successfully!"});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"Internal error"});
        
    }
})
//fecth the favorites from db 
app.get("/api/favorites/:userId",async(req,res)=>{ 
    try {
        const {userId} = req.params;

        //command to get in neon db postgresql from drizzle
        const userFavorites =await db.select().from(favoriteTable).where(eq(favoriteTable.userId,userId));


        res.status(200).json(userFavorites);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal error"});
    }
})

app.listen(PORT,()=>{
    console.log("Server is running on port no:",PORT);
})