// server.js
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Code Evaluation Service running on port ${PORT}`);
});
