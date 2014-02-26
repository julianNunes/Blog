Meteor.publish("getPostsUsaurio", function(usuario) {
    var posts = Posts.find({usuario:usuario});
    var postIds= posts.map(function(doc) { return doc._id; });
    var comenst =  Coments.find({idPost: {$in: postIds}});

    return [posts, comenst];
  });

Meteor.methods({
	removeAllPosts: function() {
		return Posts.remove({});
	}
});

