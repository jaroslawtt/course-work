import User from "../../models/users.js";
export async function controllerGetFavourites(req,res) {
    const {id:user_id} = req.query;
    const type = req.params[`type`];
    console.log(user_id,type)
    User.findOne({
        user_id,
    })
        .then(response => {
            if(response){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(response?.favourites[type]));
            }
            else{
                let newUser = new User({...response, user_id});
                User.insertMany(newUser);
                newUser.update();
                res.send(JSON.stringify(false));
            }
        })
        .catch(() => {
            res.sendStatus(404)
        })
}
export async function controllerGetFavouriteBool(req,res){
    const { id:user_id } = req.query;
    const type = req.params[`type`];
    const item_id = req.params[`id`];
    User.findOne({user_id})
        .then(response => {
            if(response){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(response?.favourites[type].includes(item_id)));
            }
            else{
                let newUser = new User({...response, user_id});
                User.insertMany(newUser);
                newUser.update();
                res.send(JSON.stringify(false));
            }
        })
        .catch(()=> {
            res.sendStatus(404);
        })
}
export async function controllerPatchFavourite(req,res){
    const { id: user_id } = req.body;
    const type = req.params[`type`];
    const item_id = req.params[`id`];
    User.findOne({
        user_id,
    })
        .then(async response => {
            let newUser;
            if(response) {
                const { favourites } = response;
                if(response.favourites[type].includes(item_id)){
                    favourites[type] = favourites[type].filter(elem => elem !== item_id);
                    newUser = {user_id, favourites};
                    await User.findOneAndReplace({ user_id }, newUser)
                        .then(()=> {
                           User.update();
                        })
                        .catch(e => {
                            console.log(e);
                        })
                    res.sendStatus(200);
                }
                else{
                    console.log(response)
                    favourites[type].push(item_id);
                    newUser =  { user_id, favourites };
                    console.log(newUser);
                    await User.findOneAndReplace({ user_id }, newUser)
                        .then(()=> {
                            User.update();
                        })
                        .catch(e => {
                            console.log(e);
                        })
                    res.sendStatus(200);
                }
            }
            else{
                    res.sendStatus(405);
            }
        })
        .catch(e => {
            console.log(e);
        })
}