const express = require("express");

const app = express();

const PORT = process.env.PORT || 4000;
const dbSetup = require("./db/db");
const authRoutes = require("./routes/authRoute");

app.use(express.json());
dbSetup();
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
