import { app } from "./app"
require("dotenv").config();




// create server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("=================================")
    console.log(`Server started on PORT ${PORT}`)
})