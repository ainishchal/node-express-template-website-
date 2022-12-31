const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const { speakerService } = params;
      const speakers = await speakerService.getList();
      const getArtwork = await speakerService.getAllArtwork();

      return response.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers, getArtwork });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:shortname', async (request, response, next) => {
    try {
      const { speakerService } = params;
      const singleSpeakerDetails = await speakerService.getSpeaker(request.params.shortname);
      const singleSpeakerArtwork = await speakerService.getArtworkForSpeaker(request.params.shortname);
      return response.render('layout', { pageTitle: `Mango `, template: 'speaker-details', singleSpeakerDetails, singleSpeakerArtwork });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}; //why this style - can send arguments and can use later

// module.exports = router
