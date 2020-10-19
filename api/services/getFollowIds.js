var Follow = require('../models/follow');
exports.getFollowIds = async function (userId){
    
    var following = await Follow.find({'user': userId}).select({'_id':0, '__v':0, 'user':0}).exec().then((follows)=>{  
        var followsClean = [];
        for (let i in follows) {
            followsClean.push(follows[i].followed._id); 
        } 
        return followsClean;
    });
    
    var followers = await Follow.find({'followed': userId}).select({'_id':0, '__v':0, 'followed':0}).exec().then((follows)=>{  
        var followsClean = [];
        for (let i in follows) {
            followsClean.push(follows[i].user._id); 
        } 
        return followsClean;
    });
    return {
        following: following,
        followers: followers
    }
};