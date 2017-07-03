//const express = require('express');
//const router = express.Router();

//const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();


//const {BlogPosts} = require('./models');

//BlogPosts.create(
//	"I Love Concerts",
//      "I've been to many concerts and I've enjoyed them all.",
//      "Jessica Ann"
//);
//BlogPosts.create(
//	"Do you love music?",
//      "Music rocks!",
//      "Sabre Ann"
//);
//BlogPosts.create(
//	"My favorite band",
//      "Today, I'll tell you my fav band.",
//      "Lisa Ann"
//);
//GET
/*router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});
//CREATE
router.post('/', jsonParser, (request, response) => {
	const reqdFields = ['title', 'content', 'author'];
	for (let i=0; i<reqdFields.length; i++) {
		const field = reqdFields[i];
		if(!(field in request.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return response.status(400).send(message);
		}
	}
	const item = BlogPosts.create(request.body.title, request.body.content, request.body.author);
		response.status(201).json(item);
});
//DELETE
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});
//UPDATE
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title','content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id
      (${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(200).json(updatedItem);
})

module.exports = router;