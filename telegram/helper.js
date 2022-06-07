const axios = require("axios");
module.exports = {
    async getInfo(type,filter){
        let results;
        await axios.get(`http://localhost:4200/api${type.match(/\/[a-z]+/)}/${filter.trim()}`)
            .then(response => {
                results = response.data.data.results
            })
            .catch(e => {
                return e;
            })
        return results;
    },
    async getKeyboard(type,filter){
        let btn = [];
            await axios.get(`http://localhost:4200/api/${type}`)
                .then(response => {
                    const characters = response.data;
                    characters.splice(0,5).forEach((value) => {
                        btn.push([{text: value.name,callback_data: `${type}/${value.id}`}]);
                    })
                })
            return btn
    },
    mainKeyboard:  [
        [{text: `👽Characters`},{text: `🎥Episodes`}],
        [ {text: `🌌Locations`}, {text: `📓Reviews`, web_app: {url: `https://uk.reactjs.org/`}}]
    ],
    async getCaption(data){
        if(data.hasOwnProperty(`status`)){
            return `<i>Name:</i><b> ${data.name}</b>
<i>Status</i>: ${data.status === `unknown`? `${data.status}🤫`: `${data.status === "Alive"? `Alive✅`: `Dead☠`}`}
<i>Species</i>: ${data.species === `Human`? `${data.species}🤷`: `${data.species}👽`}
<i>Gender</i>: ${data.gender === `unknown`? `${data.gender}🤫`: `${data.gender === "Male"? `Male👦`: `Female👧`}`}
<i>Location</i>: ${data.location.name}🌎
`
        }
        else if(data.hasOwnProperty(`dimension`)){
            return `<i>Name:</i><b> ${data.name}</b>
Type: ${data.type}
Dimension: ${data.dimension}
`
        }
        else if(data.hasOwnProperty(`description`)){

        }
        else{
            let res = `<i>Episode name:</i><b> ${data.name}</b>
Released: ${data.air_date}
Episode: ${data.episode}
Episode characters:`
             for (let apiRequest of data.characters) {
                let query = apiRequest.split(`/`).slice(-3).join(`/`);
               await axios.get(`http://localhost:4200/${query}`)
                    .then((response) => {
                        res += response.data.data.name + `,`;
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            return res;
        }
    },
    backButton: [{text: `Back`, callback_data: `Back`}]
    ,
    getPagination(query, maxpage){
        let current = parseInt(query);
        let keys = [];
        if (current === 0) keys.push({ text: `➡️`, callback_data: `${current + 1} ${query.split(` `)[query.split(` `).length - 1]}`});
        else if (current >= 1 && current < maxpage - 1) keys.push({ text: `⬅️`, callback_data: `${current - 1} ${query.split(` `)[query.split(` `).length - 1]}`},{ text: `➡️`, callback_data: `${current + 1} ${query.split(` `)[query.split(` `).length - 1]}`});
        else keys.push({ text: `⬅️`, callback_data: `${current - 1} ${query.split(` `)[query.split(` `).length - 1]}`})
        return keys;
    },
    greetings: `
👋Hey, buddy
👽 I'm created for "true fan" of "Rick and Morty", what can I do?

🔝┏ Describing main characters
🆕┣ 
📻┣ 
🔍┗ 
    `
}