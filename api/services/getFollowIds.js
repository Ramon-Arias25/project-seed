var Follow = require('../models/follow');
exports.getFollowIds = async function (user_id){
    
    var following = await Follow.find({'user': user_id}).select({'_id':0, '__v':0, 'user':0}).exec().then((follows)=>{  
        var follows_clean = [];
        for (let i in follows) {
            follows_clean.push(follows[i].followed._id); 
        } 
        return follows_clean;
    });
    
    var followers = await Follow.find({'followed': user_id}).select({'_id':0, '__v':0, 'followed':0}).exec().then((follows)=>{  
        var follows_clean = [];
        for (let i in follows) {
            follows_clean.push(follows[i].user._id); 
        } 
        return follows_clean;
    });
    return {
        following: following,
        followers: followers
    }
};