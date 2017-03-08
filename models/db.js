// Enabling connection w/ Sequelize
const Sequelize = require('sequelize');
const connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/codellab';
const db = new Sequelize(connectionString);

// Defining users model
const User = db.define('user', {
  email: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  accounttype: Sequelize.STRING
})

// Defining project model
const Project = db.define('project', {
  title: Sequelize.STRING,
  link: Sequelize.STRING,
  description: Sequelize.STRING(1000),
  question: Sequelize.STRING,
  language: Sequelize.STRING,
  likes: Sequelize.INTEGER
})

// Defining comments model
const Comment = db.define('comment', {
  username: Sequelize.STRING,
  comment: Sequelize.STRING
})

// Creating relationships
User.hasMany(Project);
Project.belongsTo(User);

Project.hasMany(Comment);
Comment.belongsTo(Project);

// User.hasMany(Comment);
// Comment.belongsTo(User);

// Syncing database and creating base user
db.sync({
	force: true,
})
.then(function(){
    return User.create({
      email: "Kevin@Kevin.com",
      username: "Kevin",
      password: "Kevin",
      accounttype: "Student"
    })
  })
.then(function(user){
      return user.createProject({
      title: "Codellab",
      link: "https://github.com/ThienNgn/Code-Matcher",
      description: "Codellab is a cool new project for receiving praise, feedback or to collab with others",
      question: "Feedback",
      language: "Javascript",
      likes: 25
    })
  })
.then(function(project) {
      return project.createComment({
        username: "Mettamage",
        comment: "Good job padawans. You finally graduated from this course by creating this project."
      })
})
.catch( (error) => console.log(error) );

module.exports = {
  db: db,
  User: User,
  Project: Project,
  Comment: Comment
}
