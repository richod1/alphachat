const User=require("../models/user.model")
const Message=require("../models/message.model")
const jwt=require("jsonwebtoken")
const {isEmailValid}=require("../util/EmailValidation")


const Register=async(req,res)=>{
    //code for registering user
    const {name,email,password,image}=req.body

    // validate email domain
    if(!isEmailValid(email)){
        return res.status(400).json({error:'Invalid email address.It must be from @ttu.edu.gh domain.'})
    }

    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(409).json({msg:"User already exists"});
    }

    const newUser=new User({name,email,password,image});

    newUser.save().then(()=>{
        res.status(200).json({message:"User registered successfully"})
    }).catch((err)=>{
        console.log("Error registering user",err)
        res.status(500).json({message:"Error registering user"})
    })
}

const createToken=async(userId)=>{
 const payload={
    userId:userId,
 }
 const token=jwt.sign(payload,process.env.JWT_SECRET,{
    expiresIn:"1h"
 })

 return token;
}

const Login=(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(401).json({message:"Email and password is required"})
    }

    User.findOne({email}).then((user)=>{
        if(!user){
            return res.status(401).json({message:"User not found"})
        }

        if(user.password !==password){
            return res.status(401).json({message:"Invalid password"})
        }

        // create user token

        const token=createToken(user._id);
        res.status(200).json({message:"User loggedIn successfully",data:token})
    }).catch((err)=>{
        console.log("error finding user",err)
        res.status(500).json({message:"Internal error"})
    })
}

// finding uer id
const Allusers=(req,res)=>{
    const loggedInUserId=body.params.userId;

    User.find({_id:{$ne:loggedInUserId}})
    .then((user)=>{
        res.status(200).json(user)
    }).catch((err)=>{
        console.log('error retriveing users',err)
        res.status(500).json({message:"Error retriveing users"})
    })
}




// friend request
const friendRequest=async(req,res)=>{
    const {currentUserId,selectedUserId}=req.body;

    try {
        //update the recepient's friendRequestsArray!
        await User.findByIdAndUpdate(selectedUserId, {
          $push: { freindRequests: currentUserId },
        });
    
        //update the sender's sentFriendRequests array
        await User.findByIdAndUpdate(currentUserId, {
          $push: { sentFriendRequests: selectedUserId },
        });
    
        res.sendStatus(200);
      } catch (error) {
        res.sendStatus(500);
      }
    
    
}

// accept friend request of particular user
const UserFriendRequest=async(req,res)=>{

    try {
        const { userId } = req.params;
    
        //fetch the user document based on the User id
        const user = await User.findById(userId)
          .populate("freindRequests", "name email image")
          .lean();
    
        const freindRequests = user.freindRequests;
    
        res.json(freindRequests);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

const AcceptUserRequest=async(req,res)=>{
try{

    const {senderId,recepientId}=req.body;

    const sender=await User.findById(senderId);
    const recepient=await User.findById(recepientId)


    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests=recepient.freindRequests.filter((request)=>recepient.toString() !== senderId.toString());

    sender.freindRequests=recepient.freindRequests.filter((request)=>request.toString()  !== senderId.toString());

    await sender.save()
    await recepient.save()

    res.status(200).json({message:"Friend Request accepted successfully"})

}catch(error){
    console.log("internal error occured",error)
    res.status(500).json({message:"Failed to accept user request"})
}
}


// get all accepted friends
const GetAllAcceptedFreinds=async (req,res) => {

    try{
        const {userId}=req.params;
        const user=await User.findById(userId).populate("friends","name email image")

        const acceptedFriends=user.friends;

        res.status(201).json(acceptedFriends)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal error"})
    }
}




  const PostMessage=async(req,res)=>{
    try {
        const { senderId, recepientId, messageType, messageText } = req.body;
    
        const newMessage = new Message({
          senderId,
          recepientId,
          messageType,
          message: messageText,
          timestamp: new Date(),
          imageUrl: messageType === "image" ? req.file.path : null,
          attachments: {
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileData: file.buffer,
          },
        });
    
        await newMessage.save();
        res.status(200).json({ message: "Message sent Successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  }

  const UserDetailes=async(req,res)=>{
    try {
        const { userId } = req.params;
    
        //fetch the user data from the user ID
        const recepientId = await User.findById(userId);
    
        res.json(recepientId);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  }

  const UsersMessages=async()=>{

    try {
        const { senderId, recepientId } = req.params;
    
        const messages = await Message.find({
          $or: [
            { senderId: senderId, recepientId: recepientId },
            { senderId: recepientId, recepientId: senderId },
          ],
        }).populate("senderId", "_id name");
    
        res.json(messages);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  }

  const DeleteMessage=async(req,res)=>{
    try {
        const { messages } = req.body;
    
        if (!Array.isArray(messages) || messages.length === 0) {
          return res.status(400).json({ message: "invalid req body!" });
        }
    
        await Message.deleteMany({ _id: { $in: messages } });
    
        res.json({ message: "Message deleted successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server" });
      }
  }

  const SentFriendsRequest=async(req,res)=>{
    try{
        const {userId} = req.params;
        const user = await User.findById(userId).populate("sentFriendRequests","name email image").lean();
    
        const sentFriendRequests = user.sentFriendRequests;
    
        res.json(sentFriendRequests);
      } catch(error){
        console.log("error",error);
        res.status(500).json({ error: "Internal Server" });
      }
  }

  const getFriends=async(req,res)=>{
    try{
        const {userId} = req.params;
    
        User.findById(userId).populate("friends").then((user) => {
          if(!user){
            return res.status(404).json({message: "User not found"})
          }
    
          const friendIds = user.friends.map((friend) => friend._id);
    
          res.status(200).json(friendIds);
        })
      } catch(error){
        console.log("error",error);
        res.status(500).json({message:"internal server error"})
      }
  }

module.exports={
    Register,
    Login,
    getFriends,
    SentFriendsRequest,
    DeleteMessage,
    UsersMessages,
    UserDetailes,
    GetAllAcceptedFreinds,
    PostMessage,
    AcceptUserRequest,
    UserFriendRequest,
    friendRequest,
    Allusers

}