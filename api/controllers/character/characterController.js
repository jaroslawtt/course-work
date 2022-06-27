import { getCharacters } from "rickmortyapi";
import { getCharacter } from "rickmortyapi";

export async function controllerGetCharacters(req, res) {
    const characters = await getCharacters();
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(characters.data.results));
}

export async function controllerGetCharacter(req, res) {
    if (isNaN(parseInt(req.params[`id`]))) {
        const character = await getCharacters({
            name: req.params[`id`],
        })
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(character));
    } else {
        const character = await getCharacter(parseInt(req.params[`id`]));
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(character));
    }
}
