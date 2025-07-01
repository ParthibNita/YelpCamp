import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model("User", UserSchema);
// This model uses passport-local-mongoose to add username and password fields
// and handles authentication methods automatically.
