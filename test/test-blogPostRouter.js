// const chai = require('chai');
// const chaiHTTP = require('chai-http');

// const {app, runServer, closeServer} = require('../server');

// const should = chai.should();

// chai.use(chaiHTTP);

// describe('BlogPosts', function(){
// 	before(function() {
// 		return runServer();
// 	});
// 	after(function() {
// 		return closeServer();
// 	});
// 	it('should list blog posts on GET', function() {
// 		return chai.request(app)
// 		.get('/blog-posts')
// 		.then(function(res) {
// 			res.should.have.status(200);
// 			res.should.be.json;
// 			res.body.should.be.a('array');
// 			res.body.length.should.be.above(0);
// 			res.body.forEach(function(item) {
// 				item.should.be.a('object');
// 				item.should.include.keys(
// 					'title', 'author', 'content', 'id');
// 			});
// 		});
// 	});
// 	it('should add a blog post on POST', function() {
// 		const newBlogPost = {title: 'covfefe', content: 'Despite all of the recent covfefe', author: 'Donald Trump'};
// 		return chai.request(app)
// 		.post('/blog-posts')
// 		.send(newBlogPost)
// 		.then(function(res) {
// 			res.should.have.status(201);
// 			res.should.be.json;
// 			res.should.be.a('object');
// 			res.body.should.include.keys('id', 'title', 'content', 'author');
// 			res.body.id.should.not.be.null;
// 			res.body.should.be.deep.equal(Object.assign(newBlogPost, {id: res.body.id, publishDate: res.body.publishDate}));
// 		});
// 	});
// 	it('should update blog post on PUT', function() {
// 		const updatePost = {
// 			title: 'Rofefe', content: 'Despite all of the recent Rovfefe', author: 'Ronald Rump'
// 		};
// 		return chai.request(app)
// 		.get('/blog-posts')
// 		.then(function(res) {
// 			updatePost.id = res.body[0].id;
// 			return chai.request(app)
// 			.put(`/blog-posts/${updatePost.id}`)
// 			.send(updatePost)
// 		})
// 		.then(function(res) {
// 			res.should.have.status(200);
// 			res.should.be.json;
// 			res.body.should.be.a('object');
// 			res.body.should.be.deep.equal(Object.assign(updatePost, {id: res.body.id, publishDate: res.body.publishDate}));
// 		});
// 	});
// 	it('should delete a post on DELETE', function() {
// 		return chai.request(app)
// 		.get('/blog-posts')
// 		.then(function(res) {
// 			return chai.request(app)
// 			.delete(`/blog-posts/${res.body.id}`);
// 		})
// 		.then(function(res) {
// 			res.should.have.status(204);
// 		});
// 	});
// });