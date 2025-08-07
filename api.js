// ******IMPORTING LIBRAIRES*********
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const util = require("util");
const router = express.Router();
const app = express();
dotenv.config(); //taking out variables of env file
mongoose.set('strictQuery', true); // to silence the warning
const cors = require("cors")
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimiter = require("express-rate-limit")

// *******MIDDLEWARE INITIATES IN EVERY REQUEST*************
app.use(cookieParser()); // to parse cookies
app.use(express.json());

// MIDDLEWARES FOR PRIVACY AND PRECAUTIONS

// Updated mongoSanitize configuration
// app.use(
//   mongoSanitize({
//     allowDots: true,
//     replaceWith: '_',
//     onSanitize: ({ req, key }) => {
//       console.warn(`Sanitized: ${key}`);
//     }
//   })
// );
// app.use((req, res, next) => {
//   if (req.body) {
//     mongoSanitize.sanitize(req.body);
//   }
//   next();
// });

app.set("trust proxy", true); //render error
app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  origin: 'https://jio-frontend-uk.vercel.app',
  credentials: true
}));
// app.use(cors({
//   origin: 'https://localhost:3000',
//   credentials: true
// }));


// RESOLVEMENT OF CORS ISSUE 
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://jio-frontend-uk.vercel.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));


const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(limiter);

// ******IMPORTING VALUES FROM .ENV FILE***********
const password = process.env.DB_PASSWORD;
const userName = process.env.DB_USERNAME;
const SECRET_KEY = process.env.SECRET_KEY;

// *******MAKING CONNECTION WITH DB***********
const dbLink = `mongodb+srv://${userName}:${password}@algo-backend.c4rl4bd.mongodb.net/jio_clone?retryWrites=true&w=majority&appName=algo-backend`;
mongoose.connect(dbLink, {
  dbName: "jio_clone", // force MongoDB to use this DB
}).then(
  function (connection) {
    console.log("connected to db");
  }
).catch(err => console.log(err));

// checking the NODE_ENV :
console.log("NODE_ENV is:", process.env.NODE_ENV);

// AUTHENTICATION ROUTES
const authRouter = require("./routers/authRouters")
app.use("/api/auth", authRouter);

// HOME PAGE ROUTES
const homeRouter = require("./routers/homeRouters");
app.use("/api/home", homeRouter);

// MOVIES PAGE ROUTES
const movieRouter = require("./routers/movieRouter");
app.use("/api/movies", movieRouter)

// TV page routes
const tvRouter = require("./routers/tvRouters");
app.use("/api/tv", tvRouter);

// user routes
const userRouter = require("./routers/userRouter");
app.use("/api/user", userRouter)

// payment routes
const paymentRouter = require("./routers/paymentRouter");
app.use("/api/payment", paymentRouter);

// video route
const VideoRouter = require("./routers/videoRouter");
app.use("/api/video", VideoRouter)

// *********SERVER SETUP**********
app.listen(3003, () => {
  console.log("server started at 3003");
})