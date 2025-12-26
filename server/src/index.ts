import express from "express";
import type {Response, Request} from "express"
import { prisma } from './prisma.js'
import adminRouter from '../routes/admin/admin.js'
const PORT = 3000;
const app = express();
app.use(express.json());
app.use("/admin", adminRouter);

app.get("/", (req : Request, res: Response) => {
    res.json({
        message : "server is running ",
        condition : "all set"
    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});