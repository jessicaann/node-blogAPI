const mongoose = require('mongoose');

//Blog Post Schema
const blogpostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  publishDate: {type: Date, default: Date.now}
});

//Virtuals
blogpostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()
});

//The thing that tells the API what info to reveal
blogpostSchema.methods.apiRev = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.publishDate
  };
}

const BlogPosts = mongoose.model('blogpost', blogpostSchema);
//^ in the string  is the name of the collection in the db
module.exports = {BlogPosts};

