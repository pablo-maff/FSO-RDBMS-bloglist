const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readings' })

User.hasMany(Session)
Session.belongsTo(User)

// Blog.hasMany(ReadingList)  // 13.21 Super Many-to Many relationship feature
// ReadingList.belongsTo(Blog) // Replaced by the <s>"BUG"</s> feature

module.exports = {
  Blog,
  User,
  ReadingList,
}
