import { drizzle } from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";
import {ENV} from './env.js'
import * as schema from "../db/Schema.js"

const sql = neon(ENV.DATABASE_URL);

//creating a table in the neon console with the schema provided
export const db = drizzle(sql,{schema});