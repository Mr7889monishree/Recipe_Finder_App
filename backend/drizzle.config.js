// to make it connected to the database we have to do following steps after creating a connect between the schema and the database we have to show that in the console for that 
import { ENV } from "./src/config/env.js";


export default {
    schema:"./src/db/Schema.js",
    out:"./src/db/migrations", //migration file will be created once we generate drizzle-kit as it will convert our js code to raw sql code for the database to understand as its a relational database
    dialect:"postgresql",
    dbCredentials:{url:ENV.DATABASE_URL},
};
