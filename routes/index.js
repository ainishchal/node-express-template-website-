const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  router.get('/', async (request, response,next) => {
    try {
      const { speakerService } = params;
      const topSpeakers = await speakerService.getList();
      const getArtwork = await speakerService.getAllArtwork();

      return response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers, getArtwork });
    } catch (error) {
      return next(error)
    }
  });
  // if (!request.session.visitcount) {
  //   request.session.visitcount = 0;
  // }

  // request.session.visitcount += 1;
  // console.log(`Numbers of visits ${request.session.visitcount}`);

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));
  return router;
}; //why this style - can send arguments and can use later

// module.exports = router
