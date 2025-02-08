import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please define mongodb uri in env file");
    
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectToDatabase() {
    // here we are handling 3 cases 1: if connection is established 2: if connection is not there 3: if connection process is in progress
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }

    return cached.conn;
}