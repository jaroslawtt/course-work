import dotenv from "dotenv";
dotenv.config({path: "../vars/.env"});
import express from "express";
import mongoose from "mongoose";
import {controllerGetCharacter as getCharacter, controllerGetCharacters as getCharacters} from "./controllers/character/characterController.js";
import {controllerGetLocation as getLocation, controllerGetLocations as getLocations} from "./controllers/location/locationController.js";
import {controllerGetEpisode as getEpisode, controllerGetEpisodes as getEpisodes} from "./controllers/episode/episodeController.js";
import { controllerGetFavourites as getFavourites, controllerGetFavouriteBool as getFavouriteBool, controllerPatchFavourite as patchFavourite, controllerPostFavourite as postFavourite } from "./controllers/favourite/favouriteController.js";
import User from "./models/users.js";
const PORT = 4200;
const jsonParser = express.json();
let app = new express();
const apiRouter = express.Router();

apiRouter.get(`/character`, getCharacters);
apiRouter.get(`/character/:id`, getCharacter);
apiRouter.get(`/episode`,getEpisodes);
apiRouter.get(`/episode/:id`,getEpisode);
apiRouter.get(`/location`, getLocations);
apiRouter.get(`/location/:id`,getLocation);
apiRouter.get(`/favourite/:type`, getFavourites);
apiRouter.get(`/favourite/:type/:id`, getFavouriteBool)
apiRouter.patch(`/favourite/:type/:id`, jsonParser, patchFavourite);
apiRouter.post(`/favourite`, jsonParser, postFavourite)
app.use(`/api`,apiRouter);
mongoose.connect(process.env.dbUrl,{ useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if(err) throw err;
    app.listen(PORT,() => {
        console.log(`Server started on the ${PORT} PORT...`)
        app.locals.usersCollection = User;
    })
})
process.on("SIGINT", ()=> {
    mongoose.disconnect();
    process.exit();
})