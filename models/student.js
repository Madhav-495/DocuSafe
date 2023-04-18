const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const StudentSchema=mongoose.Schema({
    registrationNumber:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        // required:true,
    },
    email:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },
    hashes:[{
        name:{type:String},
        description:{type:String},
        url:{type:String}
    }],
    texthashes:[{
        name:{type:String},
        description:{type:String},
        url:{type:String}
    }],
    tokens:[
        {
            token:{
                type:String,
                // required:true,
            }
        }
    ],
    
})
StudentSchema.methods.generateAuthToken= async function(){
    try {
        let token=jwt.sign({_id:this._id.toString()},"MYNAMEISMADHAVMYNAMEISMADHAVMYNA");
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}
module.exports=mongoose.model('Student',StudentSchema)
