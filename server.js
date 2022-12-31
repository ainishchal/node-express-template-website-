const { response } = require('express');
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const SpeakersService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');

const app = express();

const port = 3000;

// app.use((req, res, next) => {
//   res.locals.someVariable = 'Hello';
// });

// const a = speakerService.getNames()
// a.then(res => {
//     console.log(res)
// })

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.locals.siteName = 'Roux Meetup';

app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['Ghdur687465345', 'hhjjdfhghbgtrgkjt'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

// app.use((req, res, next) => {
//   return next(createError(404, 'File Not Found'));
// });

app.use((error, req, res, next) => {
  res.locals.message = error.message;
  console.error(error);
  const status = error.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

// app.use('/speakers',speakersRoute());
// app.use('/feedback',feedbackRoutes());
// app.get('/', (request, response) => {
//   //   response.sendFile(path.join(__dirname, '/static/index.html'));
//   response.render('pages/index', { pageTitle: 'Welcome' });
// });

app.listen(port, () => {
  console.log(`Express Server is Listening on Port ${port}`);
});
