import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    user_id: String,
    favourites: {
        character: [String],
        episode: [String],
        location: [String],
    }
})
const User = mongoose.model(`User`, userSchema);
export default User;