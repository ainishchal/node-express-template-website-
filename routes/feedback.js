const { request, response } = require('express');
const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');

const validation = [
  check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is Required'),
  check('email').trim().isEmail({ min: 3 }).normalizeEmail().withMessage('A Valid Email is Required'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('A Title is Required'),
  check('message').trim().isLength({ min: 5 }).escape().withMessage('A Message is Required'),
];
module.exports = (params) => {
  const { feedbackService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();

      const errors = request.session.feedback ? request.session.feedback.errors : false;
      const successMessage = request.session.feedback ? request.session.feedback.message : false;
      console.log(successMessage);
      request.session.feedback = {};

      return response.render('layout', { pageTitle: 'Feedback', template: 'feedback', feedback, errors, successMessage });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', validation, async (request, response, next) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
      } else {
        const { name, email, title, message } = request.body;

        await feedbackService.addEntry(name, email, title, message).then((response) => {
          request.session.feedback = {
            message: 'Thank You For Your FeedBack',
          };
        });
      }

      return response.redirect('/feedback');
    } catch (error) {
      next(error);
    }
  });

  // router.post('/:feedback',async (request, response, next) => {
  //   try {
  //     return response.send(`feedback ${request.params.feedback}`);
  //   } catch (error) {
  //     return next(error);
  //   }
  // });

  //Rest API
  router.post('/api', validation, async (request, response, next) => {
    const errors = validationResult(request);

    try {
      if (!errors.isEmpty()) {
        return response.json({ errors: error.array() });
      }

      const { name, email, title, message } = request.body;

      await feedbackService.addEntry(name, email, title, message).then((res) => {
        console.log('API Data Submitted');
      });
      const feedback = await feedbackService.getList();
      return response.json({ feedback });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}; //why this style - can send arguments and can use later

// module.exports = router
