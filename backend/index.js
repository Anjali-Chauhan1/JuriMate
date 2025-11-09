import app from "./app.js";
import cors from "cors"

const PORT = process.env.PORT || 8080;
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
})) 

app.listen(PORT, () => {
  console.log(`JuriMate backend running on port ${PORT}`);
});
