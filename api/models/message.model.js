const mongoose=require("mongoose")

const MessageSchema=new mongoose.Schema({
 senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
 },
 recepientId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
 },
 messageType:{
    type:String,
    enum:["text","image","attachments"],
 },
 message:String,
 imageUrl:String,
 attachments:[
    {
        fileName:String,
        fileType:String,
        fileSize:Number,
        fileData:Buffer,
    }
],
timeStamp:{
    type:Date,
    default:Date.now,
}
})

const message=mongoose.model("Message",MessageSchema)

module.exports=message;