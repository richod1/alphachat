const express=require("express")
const router=express.Router();
const { Register,
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
    Allusers}=require("../controller/controller")

const {upload}=require("../util/upload")


router.post('/register',Register)

router.post('/login',Login)

router.get('/users/:userId',Allusers)

router.get('/friend-request',friendRequest)

router.get('/friend-request/:userId',UserFriendRequest)

router.post('/friend-request/accept',AcceptUserRequest)

router.get('/accepted-friends/:userId',GetAllAcceptedFreinds)

router.post('/messages',upload.single("file"),PostMessage)

router.get('/user/:userId',UserDetailes)

router.get('/message/:senderId/:recepientId',UsersMessages)

router.post('/deleteMessages',DeleteMessage)

router.get('/friend-request/sent/:userId',SentFriendsRequest)

router.get('/friends/:userId',getFriends)

module.exports=router;