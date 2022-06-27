import {getLocation,getLocations} from "rickmortyapi";
export async function controllerGetLocations(req,res){
    const locations = await getLocations();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(locations.data.results));
}
export async function controllerGetLocation(req,res){
    if(isNaN(parseInt(req.params[`id`]))){
        const location = await getLocations({
            name: req.params[`id`]
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(location));
    }
    else{
            const location = await getLocation(parseInt(req.params[`id`]));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(location));
    }
}