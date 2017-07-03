const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('bodyParser');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {BlogPosts} = require('./models');

const app = express();
//^create an express instance(server)

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));

app.use(express.static('public'));
// ^this gets the files that are in our public folder


//READ - GET
app.get('/posts', (req, res) => {
  BlogPosts
    .find()
    .limit(5)
    .exec()
    .then(posts => {
      res.json({
        posts: posts.map(
          (posts) => posts.apiRev())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.ststus(500).json({messsge: 'Internal server error'});
      });
});

//READ - GET BY ID
app.get('/posts/:id', (req, res) => {
  BlogPosts
    .findById(req.params.id)
    .exec()
    .then(posts =>res.json(posts.apiRev()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

//CREATE
app.post('/posts', (req, res) => {
  const reqdFields = ['title', 'content', 'author'];
  for (let i=0; i<reqdFields.length; i++) {
    const field = reqdFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  BlogPosts
    .create({
      title: req.body.title,
      content: req.body.content,
      author: {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }
    })
    .then(
      posts => res.status(201).json(blogposts.apiRev()))
      //did I name this right?      ^
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    })
});

//DELETE
app.delete('/posts/:id', (req, res) => {
  BlogPosts
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(posts => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//UPDATE
app.put('/posts/:id', (req, res) => {
 const requiredFields = ['title','content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
    if (!(req.params.id && req.body.id === req.body.id)) {
      const message = (`Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      res.status(400).send(message);
    }
  const toUpdate = {};
  const updateableFields = ['title', 'author', 'content'];
 
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
});

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if(err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
		});
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
