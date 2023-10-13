// const multer = require('multer');

// const up=function(req,res,cb){

//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//           cb(null, 'uploads/'); // Save uploads in the "uploads" folder
//         },
//         filename: (req, file, cb) => {
//           cb(null, Date.now() + '-' + file.originalname); // Create unique file names
//         },
//       });
      
//       const upload = multer({ storage: storage });
// return upload      
// }
// // // Middleware to handle file uploads
// // app.post('/upload', upload.single('video'), (req, res) => {
// //   res.json({ message: 'File uploaded successfully' });
// // });
