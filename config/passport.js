const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Admin Model
const Admin = mongoose.model('admin');

module.exports= (passport)=>{
     passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
         Admin.findOne({email: email})
            .then(admin=>{
                if(admin){
                    bcrypt.compare(password, admin.password,(err, isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null,admin)
                        }
                        else{     
                            return done(null, false, {message: 'Password doesn\'t Match '})
                        }
                    })
                }
                else{
                    return done(null, false, {message: 'No Admin found'})
                }
            })
     }))
     passport.serializeUser(function(admin, done) {
        done(null, admin.id);
      });
      
      passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, admin) {
          done(err, admin);
        });
      });
}
