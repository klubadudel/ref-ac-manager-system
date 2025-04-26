const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Optionally define custom routes
app.get('/', (req, res) => res.redirect('/login/index.html'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
