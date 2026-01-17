import "dotenv/config";
import app from "./app";

const port = Number(process.env.PORT ?? 4000);


app.get("/server/test/running", (req, res) => {
  res.json({
    message: "Server is running",
    testStatus : "Passed"
  })
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

