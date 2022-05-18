import rollbar from "../config/rollbar";

const logger = (...arg) => {
  try {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log(...arg);
  }
  rollbar.log(...arg);
  } catch (error) {
    console.log(error.message, 'logger catch block')
    rollbar.log(error)
  }

};

export default logger;