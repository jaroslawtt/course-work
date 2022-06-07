import express from "express";
import {controllerGetCharacter as getCharacter, controllerGetCharacters as getCharacters} from "./controllers/character/characterController.js";
import {controllerGetLocation as getLocation, controllerGetLocations as getLocations} from "./controllers/location/locationController.js";
import {controllerGetEpisode as getEpisode, controllerGetEpisodes as getEpisodes} from "./controllers/episode/episodeController.js";
import {controllerGetReviews as getReviews, controllerAddReview as addReview, controllerClearReviews as clearReviews, controllerDeleteReview as deleteReview, controllerEditReview as editReview} from "./controllers/review/reviewController.js";
const PORT = process.env.port || 4200;
const jsonParser = express.json();
let app = new express();
const apiRouter = express.Router();
apiRouter.get(`/character`, getCharacters);
apiRouter.get(`/character/:id`, getCharacter);
apiRouter.get(`/episode`,getEpisodes);
apiRouter.get(`/episode/:id`,getEpisode);
apiRouter.get(`/location`, getLocations);
apiRouter.get(`/location/:id`,getLocation);
apiRouter.get(`/reviews`,getReviews);
apiRouter.post(`/reviews`,jsonParser ,addReview);
apiRouter.put(`/reviews`,jsonParser, editReview);
apiRouter.delete(`/reviews/:episode`, deleteReview);
apiRouter.delete(`/reviews`,clearReviews);
app.use(`/api`,apiRouter);
app.listen(PORT, ()=> {
    console.log(`Server has been started on port ${PORT}...`);
})