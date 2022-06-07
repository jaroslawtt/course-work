import * as path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';
import {raw} from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function writeSchema(path,schema){
    await fs.writeFile(path,JSON.stringify(schema),err => {
        return err;
    });
}
export async function controllerGetReviews(req,res) {
    let userId = req.query.id;
    await fs.readFile(path.join(__dirname, `reviews.json`),{encoding: "utf8"}, (err,data)=> {
        if(err) throw new Error(err.name);
        let reviews;
        let reviewSchema = JSON.parse(data);
        if(reviewSchema.hasOwnProperty(userId)){
            reviews = reviewSchema[userId]
        }
        else{
            reviewSchema[userId] = [];
            reviews = reviewSchema[userId]
            writeSchema(path.join(__dirname,`reviews.json`),reviewSchema)
        }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(reviews));

    })
}
export async function controllerDeleteReview(req,res){
    let userId = req.query.id;
    let reviewToDelete = req.params[`episode`];
    let reviews = [];
    await fs.readFile(path.join(__dirname, `reviews.json`),{encoding: "utf8"},async (err,data)=> {
        let reviewSchema = JSON.parse(data);
        reviews = reviews.concat(reviewSchema[userId]);
        reviews = reviews.filter(element => element.episode.toLowerCase() !== reviewToDelete.toLowerCase());
        reviewSchema[userId] = reviews;
        fs.writeFile(path.join(__dirname, `reviews.json`),JSON.stringify(reviewSchema), err => {
            console.log(err);
        })
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(reviews))
    })
}
export async function controllerClearReviews(req,res){
    let userId = req.query.id;
    await fs.readFile(path.join(__dirname,`reviews.json`),{
        encoding: "utf8",
    }, async (err,data)=> {
        let reviewSchema = JSON.parse(data);
        reviewSchema[userId] = [];
        await writeSchema(path.join(__dirname,`reviews.json`), reviewSchema);
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify([]));
    })
}
export async function controllerEditReview(req,res){
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    const {episode,rate,description, id: userId} = req.body;
    let reviews = [];
    await fs.readFile(path.join(__dirname,`reviews.json`), {
        encoding: "utf8",
    }, async (err,data)=> {
        let reviewSchema = JSON.parse(data);
        reviews = reviews.concat(reviewSchema[userId]);
        reviews.forEach(value => {
            if(value.episode === episode){
                value.rate = rate;
                value.description = description;
            }
        });
        reviewSchema[userId] = reviews;
        await writeSchema(path.join(__dirname,`reviews.json`),reviewSchema);
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(reviews));
    })
}
export async function controllerAddReview(req,res){
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    const {episode,rate,description,id:userId} = req.body;
    let newReview = {
        episode,
        rate,
        description
    }
    let reviews = [];
    await fs.readFile(path.join(__dirname,`reviews.json`), {
        encoding: "utf8",
    }, async (err,data)=> {
        let reviewSchema = JSON.parse(data);
        reviews = reviews.concat(reviewSchema[userId]);
        reviews.push(newReview);
        reviewSchema[userId] = reviews;
        await writeSchema(path.join(__dirname,`reviews.json`),reviewSchema);
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(reviews));
    })
}