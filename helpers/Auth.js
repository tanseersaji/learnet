module.exports={
    ensureAdminAuthenticated: (req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect('/ln-admin/')
        }
    },
    ensureStudentAuthenticated:(req,res,next)=>{
        if(res.locals.userUid || req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect('/')
        }
    }
}