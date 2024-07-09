import express from 'express';
const app = express();
const config = require('./src/config/config')['development'];
const port = config.port;
import mongoose from 'mongoose';
const url = config.dburl;
import mainRouter from './src/router/main';
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cookieParser());

app.use('/api', mainRouter);
try {
  mongoose.connect(url).then(() => {
    console.log('db connected !');
  });
} catch (error) {
  console.log('mongoose connection error:', error);
}

app.listen(port, () => {
  console.log(`server listen on port no ${port}`);
});











// CLUSTRING CODE:
// // Import necessary modules
// import cluster from 'cluster';
// import os from 'os';
// import express from 'express';
// import mongoose from 'mongoose';
// import cookieParser from 'cookie-parser';
// const config = require('./src/config/config')['development'];
// import mainRouter from './src/router/main';

// const numCPUs = os.cpus().length;
// const app = express();

// // Configuration
// const env = process.env.NODE_ENV || 'development';
// const port = config.port;
// const url = config.dburl;

// // Master process handling clustering
// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Handle worker process death and restart
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
//     console.log('Starting a new worker');
//     cluster.fork();
//   });
// } else {
//   // Worker processes run the application
//   mongoose.connect(url)
//     .then(() => {
//       console.log('MongoDB connected');
//     })
//     .catch((err) => {
//       console.error('MongoDB connection error', err);
//       process.exit(1); // Exit if MongoDB connection fails
//     });

//   // Middleware and routes setup
//   app.use(express.json());
//   app.use(cookieParser());
//   app.use('/api', mainRouter);

//   // Start the server
//   app.listen(port, () => {
//     console.log(`Worker ${process.pid} started and listening on port ${port}`);
//   });
// }

// // Log when a worker is killed
// cluster.on('exit', (worker) => {
//   console.log(`Worker ${worker.process.pid} died`);
// });
