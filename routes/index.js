// const loginRoutes = require('./login');
// const logoutRoutes = require('./logout');
// const mainRoutes = require('./main');
// const privateRoutes = require('./private');
// const signupRoutes = require('./signup');

const cSearchRoutes = require('./chooseWhatToSearch');
const searchRoutes = require('./search');
const mypageRoutes = require('./mypage');
const shuffleRoutes = require('./shuffle');
const signupRoutes = require('./signup');
const myprofileRoutes = require('./myprofile');
const loginRoutes = require('./login');
const constructorMethod = (app) => {
    //app.use('/', indexRoutes)
    app.get('/', (req, res) =>{
        res.status(200).render("pages/index", {});
    })

    app.use('/chooseWhatToSearch', cSearchRoutes);
    app.use('/', searchRoutes);
    app.use('/', mypageRoutes);
    app.use('/shuffle', shuffleRoutes);
    app.use('/signup', signupRoutes);
    app.use('/loginlogout', loginRoutes);
    app.use('./myprofile', myprofileRoutes);

  
  app.use('*', (req, res) => {
    res.status(404).render("pages/404", {});
  });
};

module.exports = constructorMethod;