import mongoose from 'mongoose' //npm i mongoose

//Databse connection from backend
export async function connectionDb(){
    try{
        mongoose.connect(process.env.MONGO_URL)
        console.log(process.env.MONGO_URL);
        const dbConnection = mongoose.connection
        dbConnection.on('connected', () => {
            console.log("MongoDb connected Successfully....")
        })
        dbConnection.on('error',(e) =>{
            console.log("MongoDb Connection Error" + e)
        })
    } catch(error){
        console.log("Something Goes Wrong...")
        console.log(error)
    }
}