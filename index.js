// Import required modules
var express = require('express');
var cors = require('cors');
var multer = require('multer');
var path = require('path');
require('dotenv').config();

// Initialize the Express app
var app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// Serve static files from the "public" folder
app.use('/public', express.static(process.cwd() + '/public'));

// Set up Multer storage to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');  // Define where to store the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });

// Endpoint for the file upload and metadata analysis
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (req.file) {
    // Send back file metadata as JSON
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// Serve the HTML file on the root route
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Set the port for the app to listen on
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
