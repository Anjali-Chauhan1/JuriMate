import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config"



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`JuriMate backend running on port ${PORT}`);
});
