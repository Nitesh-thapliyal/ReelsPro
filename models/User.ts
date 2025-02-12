import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: {type: String,required: true,unique: true},
  password: {type: String,required: true},
}, {timestamps: true});


// hash password before saving to the db : pre is called a hook : and next is a callback fn provided by mongodb that calls next middleware
userSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password  = await bcrypt.hash(this.password, 10)
    }
    next();
})

// everything on nextjs runs on edge so we need to check does User model already exist or not
const User =models?.User || model<IUser>("User", userSchema)

export default User;