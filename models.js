const mongoose = require('mongoose');

//Blog Post Schema
const blogpostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    required: true,
    //^Is this how I make this required?
    firstName: String,
    lastName: String
  },
  publishDate: publishDate || Date.now()
});

//Virtuals
blogpostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()
});

//The thing that tells the API what info to reveal
blogpostSchema.methods.apiRev = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.publishDate
  };
}

const BlogPosts = mongoose.model('BlogPosts', blogpostSchema);

module.exports = {BlogPosts};

