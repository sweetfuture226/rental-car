import express, {
  Application,
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from 'express';
import os from 'os';
import formData from 'express-form-data';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import Routes from './routes';
import rollbar from './config/rollbar';
dotenv.config();

const app: Application = express();

// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true,
// };

// app.use(formData.parse(options));
// app.use(formData.format());
// app.use(formData.stream());
// app.use(formData.union());

const whitelist = process.env.WHITELIST.split(',');
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api/v1/stripe/webhook', bodyParser.raw({ type: '*/*' }));
app.use(express.json());
app.use(cookieParser());

app.use((err: boolean, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(400).json({ error: 'Invalid Request data' });
  } else {
    next();
  }
});

app.get('/', (req, res: Response) =>
  res.status(200).json({
    message: 'Welcome to the Quik Influence CRM',
  }),
);

Routes(app);

// Use the rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler());

app.use((req, res: Response) =>
  res.status(404).json({
    status: 404,
    error: `Route ${req.url} Not found`,
  }),
);

export { app };
