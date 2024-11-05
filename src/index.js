
import dotenv from "dotenv"
import connectDB from "./DataBase/index.js"
// import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js"
// import express from "express"
dotenv.config({
    path: "./env"
})

connectDB()
// const app = express()
// iffies
// (async () => {
//     try {
//         const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         // app.on("errror", (err) => {
//         //     console.log("error", err)
//         //     throw err
//         // })
//         // app.listen(process.env.PORT, () => {
//         //     console.log(`Server is running at ${process.env.PORT}`)
//         // })
//     }
//     catch (err) {
//         console.log("Error ", err)
//     }

// })()