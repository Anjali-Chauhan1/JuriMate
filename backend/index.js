import app from "./app.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`JuriMate backend running on port ${PORT}`);
});
