import console = require("node:console");

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req : String ,res : any)=>{
    res.json({
        message : "Welcome to express server"
    })
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
