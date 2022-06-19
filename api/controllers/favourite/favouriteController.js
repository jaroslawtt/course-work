import User from "../../models/users.js";
export async function controllerGetFavourites(req,res) {
    const {user_id,type} = req.body;
    User.findOne({
        id: user_id,
    })
        .then(async response => {
            console.log(response);
            if(!response){
                let user = new User({
                    user_id,
                    favourites: {
                        character: [],
                        episode: [],
                        location: [],
                    }
                });
                await User.insertMany(user)
                user.update();
                res.send(JSON.stringify(user.favourites[type]))
            }
            else{
                res.send(JSON.stringify(response.favourites[type]))
            }
        })
}
export async function controllerPatchFavourites(req,res) {

}