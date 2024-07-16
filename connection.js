import mongoose from 'mongoose'
mongoose.set("strictQuery", true);

async function connectMongoDB(name) {

const uri = `mongodb://127.0.0.1:27017/${name}`;

mongoose.connect(uri)
    .then(res => {
        console.log("mongoDB CONNECTED!")
        return res
    })
    .catch(err => {
        console.log("mongoDB error", err.message)
        return err
    })

}

export default connectMongoDB