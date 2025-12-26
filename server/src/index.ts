import express from "express";
import { prisma } from './prisma.js'
const PORT = 3000;
const app = express();
app.use(express.json());


















app.get("/", (req : any, res: any) => {
    res.json({
        message : "server is running ",
        condition : "all set"
    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})