import { getEpisode, getEpisodes } from "rickmortyapi";

export async function controllerGetEpisodes(req, res) {
    const episodes = await getEpisodes();
    res.setHeader(`Content-type`, `application/json`);
    res.end(JSON.stringify(episodes.data.results));
    }
export async function controllerGetEpisode(req, res){
        if(isNaN(parseInt(req.params[`id`]))){
            if(/S\d\dE\d\d/.test(req.params[`id`])){
                const episode = await getEpisodes({
                    episode: req.params[`id`]
                })
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(episode))
            }
            else{
                const episode = await getEpisodes({
                    name: req.params[`id`]
                })
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(episode));
            }
        }
        else{
            console.log(req.params[`id`]);
            const episode = await getEpisode(parseInt(req.params[`id`]));
            res.setHeader(`Content-type`, `application/json`);
            res.end(JSON.stringify(episode));
        }
}
