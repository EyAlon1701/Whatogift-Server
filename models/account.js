import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    associateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    firstName: String,
    lastName: String,
    dob: Date,
    gender: String,
    avatar: { type: String, default: 'https://w1.pngwing.com/pngs/509/295/png-transparent-circle-design-avatar-cartoon-football-video-games-color-sports-equipment-world.png'},
    isVerified: {type: Boolean, default:false},
    passcode: Number,
    contact: {
        address: String,
        city: String,
        state: String,
        zipcode: String,
        mobile: String,
    }
})

export default mongoose.model('Account', accountSchema);