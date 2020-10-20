var Follow = require('../models/follow');
var {getFollowIds} = require('../services/getFollowIds');

function saveFollows (req,res) {
    
    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = req.params.follow;
    follow.createdAt = moment().unix();
    
    follow.save((err, followStored) => {
        if (err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

        if (!followStored) return res.status(404).send({message:'El seguimiento no se ha guardado'});

        return res.status(200).send({follow:followStored});
    });
}

function deleteFollows (req,res){
    Follow.find({'user': req.user.sub, 'followed':req.params.id}).deleteOne(err => {
        if (err) return res.status(500).send({message: 'Error al dejar de seguir'});

        return res.status(200).send({message: 'El follow se ha eliminado!'});
    });
}


async function getFollowingUsers (req,res){
    
    var userId = req.user.sub;
    var itemsPerPage = 4;
    var page = 1;

    if(req.params.id && req.params.page) userId = req.params.id;

    if(req.params.page){
        page = req.params.page;
    } else{
        page = req.params.id;
    }

    Follow.find({user:userId}).populate({path: 'followed'}).paginate(page,itemsPerPage, (err, follows, total) => {
        
        if (err) return res.status(500).send({message: 'Error en el servidor'});

        if (!follows) return res.status(404).send({message: 'No hay Follows'});

        getFollowIds(userId).then((value) => {
            for (let i in follows) {
            follows[i].followed.password = undefined;
            }
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                following: value.following,
                follower: value.followers,
            });
        });

    });
}

async function getFollowedUsers (req,res){
    
    
    var userId = req.user.sub;
    var itemsPerPage = 4;
    var page = 1;

    if(req.params.id && req.params.page) userId = req.params.id;

    if(req.params.page){
        page = req.params.page;
    } else{
        page = req.params.id;
    }

    Follow.find({followed:userId}).populate({path:'user'}).paginate(page,itemsPerPage, (err, follows, total) => {
        
        if (err) return res.status(500).send({message: 'Error en el servidor'});

        if (!follows) return res.status(404).send({message: 'No hay Follows'});

        getFollowIds(userId).then((value) => {
            for (let i in follows) {
            follows[i].followed.password = undefined;
            }
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                following: value.following,
                follower: value.followers,
            });
        });

    });
}

function getMyFollows (req,res){

    var find = Follow.find({user:req.user.sub});

    if(req.params.followed){
        find = Follow.find({followed: req.user.sub});
    }

    find.populate('user').exec((err, follows) => {
        if (err) return res.status(500).send({message: 'Error en el servidor'});

        if(!follows) return res.status(404).send({message: 'No sigues ningun usuario'});

        for (let i in follows) {
            follows[i].user.password = undefined;
        }
        
        return res.status(200).send({follows});
    });
}

module.exports = {
    saveFollows,
    deleteFollows,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}