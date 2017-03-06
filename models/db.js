// Enabling connection w/ Sequelize
const Sequelize = require('sequelize');
const connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/nodeblog';
const db = new Sequelize(connectionString);

const User = db.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  accounttype: Sequelize.STRING
})

// Syncing database and creating base user
db.sync({
	force: true,
})
.then(function(){
    return User.create({
      username: "Ari",
      password: "Ari",
      email: "Ari@Gold.com",
      accounttype: "Junior"
    })
  })
.catch( (error) => console.log(error) );

module.exports = {
  db: db,
  User: User
}
