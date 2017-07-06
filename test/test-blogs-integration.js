const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {BlogPosts} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogData() {
	console.info('seeding blog data');
	const seedData = [];

	for (let i=1; i<=10; i++) {
		seedData.push(generateBlogData());
	}
	return BlogPosts.insertMany(seedData);
}

function generateBlogData() {
	return {
		title: faker.lorem.words(),
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		},
		content: faker.lorem.paragraph()
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('BlogPosts API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return seedBlogData();
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	})

	describe('GET endpoint', function() {
		it('should return all blog posts', function() {
			let res;
			return chai.request(app)
				.get('/posts')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);
					return BlogPosts.count();
				})
				.then(function(count) {
					res.body.should.have.length.of(count);
				});
		});
		it('should return blog posts with correct fields', function() {
			let resPost;
			return chai.request(app)
			.get('/posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.length.of.at.least(1);

				res.body.forEach(function(blogpost) {
					blogpost.should.be.a('object');
					blogpost.should.include.keys(
						'id', 'title', 'author', 'content');
				});
				resPost = res.body[0];
				return BlogPosts.findById(resPost.id);
			})
			.then(function(blogpost) {
				resPost.id.should.equal(blogpost.id);
				resPost.title.should.equal(blogpost.title);
				resPost.author.should.equal(blogpost.authorString);
			});
		});
	});
	describe('POST endpoint', function() {
		it('should add a new blog post', function() {
			const newBlogPost = generateBlogData();

			return chai.request(app)
			.post('/posts')
			.send(newBlogPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id', 'title', 'content', 'author');
				res.body.title.should.equal(newBlogPost.title);
				res.body.id.should.not.be.null;
				console.log(res.body.author);
				console.log(newBlogPost);
				res.body.author.should.equal(newBlogPost.authorString); //We would need to importa virtual to make this work?
				res.body.content.should.equal(newBlogPost.content);

				return BlogPost.findById(res.body.id); //<--Im confused about if this is
				//referring the model or what?
			})
			.then(function(blogpost) {
				blogpost.title.should.equal(newBlogPost.title);
				blogpost.author.should.equal(newBlogPost.authorString);
				blogpost.content.should.equal(newBlogPost.content);
			});
		});
	});
	describe('PUT endpoint', function() {
		it('should update fields you send over', function() {
      		const updateData = {
        		title: 'Covfefe',
        		content: 'Despite the recent covfefe'
      		};
		    return BlogPosts
		    	.findOne()
		        .exec()
		        .then(function(blogpost) {
		          updateData.id = blogpost.id;

	        return chai.request(app)
	            .put(`/posts/${blogpost.id}`)
	            .send(updateData);
	    	})
	        .then(function(res) {
	        	res.should.have.status(201);
	        	res.should.be.json;
	          	res.body.should.be.a('object');
	          	res.body.title.should.equal(updateData.title);
	          	res.body.content.should.equal(updateData.content);
	          
	          return BlogPosts.findById(updateData.id).exec();
	        })
	        .then(function(blogpost) {
	        	blogpost.title.should.equal(updateData.title);
	        	blogpost.content.should.equal(updateData.content);
	        });
   		});
	});

	describe('DELETE endpoint', function() {
		it('delete a blog post by id', function() {
			let blogpost;
			return BlogPosts
				.findOne()
				.exec()
				.then(function (_blogpost) {
					blogpost = _blogpost;
					return chai.request(app).delete(`/posts/${blogpost.id}`);
				})
				.then(function(res){
					res.should.have.status(204);
					return BlogPosts.findById(blogpost.id).exec();
				})
				.then(function(_blogpost) {
					should.not.exist(_blogpost);
				});
		});
	});
});