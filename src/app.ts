import express, { type Application } from "express"

const app: Application = express()



app.get("/", (req, res)=>{
    res.send("Server is running properly")
})

export default app;