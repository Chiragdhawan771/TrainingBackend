
import dotenv from "dotenv"
import connectDB from "./DataBase/index.js"
import { app } from "./app.js"


dotenv.config({
    path: "./env"
})

connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is Running at ${process.env.PORT}`)
    })
}).catch((err) => { console.log(err, "Connection Failed") })

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