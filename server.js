const express = require('express');
const morgan = require('morgan');

const app = express();
//^remind me what this does again?

const blogPostsRouter = require('./blogPostsRouter');

app.use(morgan('common'));

app.use(express.static('public'));
// ^this gets the files that are in our public folder

/*app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
}); <if we want to send an HtML file to be viewed */ 

app.use('/blog-posts', blogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});