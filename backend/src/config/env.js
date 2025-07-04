import "dotenv/config"//if we dont specify this then the port number in env file will not be fetched and will be undefined where it will take the alternate number as port so this is why importing dotenv library is important here which is symbolizing .env file here for storing import API key values and import details of the backend like port no api key and all and api connecting id and all will be stored there and inorder to access that we need to import dotenv/config module to be accessed in the main servers


//we will get now all of our environment variable from one place which is env.js file
export const ENV={
    PORT:process.env.PORT,
    DATABASE_URL:process.env.DATABASE_URL,
    NODE_ENV:process.env.NODE_ENV,
    API_URL:process.env.API_URL,

}