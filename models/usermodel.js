import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "please enter name"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  console.log("Prehook save :");
  const salt = await bcrypt.genSalt(process.env.NUM_OF_SALT);
  const hashedPass = await bcrypt.hash(this.password, salt);
  this.password = hashedPass;
});

export const User = mongoose.model("User", userSchema);
