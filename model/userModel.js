const mongoose=require("mongoose");

// wishlist Schema
const wishListItemSchema = new mongoose.Schema({
  poster_path: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
  media_type: { type: String, required: true }
});

const schemaRule={
    name:{
        type: String,
        required:[true, "name is required"]
    },
    email:{
        type: String,
        required:[true,"email is required"],
        unique: [true,"unique email is required"]
    },
    password:{
        type:String,
        minLength: [8,"minimum length required is 8"],
        required:[true,"password is required"]
    },
    confirmPassword:{
        type:String,
        required:[true,"confirm password is required"],
        // here we have to write the custom validation
        validate: [function(){
            return this.password===this.confirmPassword
        },"password and confirm password should be same"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isPremium:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["user","admin","feed curator","moderator"],
        default:"user"
    },
    otp: {
    type: String
    },
    otpExpiry: {
    type: Date
    },
    wishList:{wishListItemSchema}
}

const userSchema= new mongoose.Schema(schemaRule);
// final touch point
// this feature is used for implemeting the hiding of the confirm password in mongo DB -MiddleWare
// **************hooks in mongoDB*****************
userSchema.pre("save",function (next){
    this.confirmPassword=undefined;
    next();
})
const validRoles = ["user","admin","feed curator","moderator"];

userSchema.pre("save",function(next){
    const isValid = validRoles.find((role)=>{return this.role==role});
    if(isValid){
        next();
    }else{
        next("Role is not allowed")
    }
});

userSchema.post("save",function(){
    this.__v =undefined;
    this.password=undefined;
});

const userModel = mongoose.model("user",userSchema);

// exporting user model file
module.exports=userModel;