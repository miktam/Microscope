Meteor.publish('posts', function(view, limit){
  var order = {};

  switch(view){
    case 'new':
      order = {submitted: -1, _id: -1};
      break;
    case 'best':
      order = {votes: -1, submitted: -1, _id: -1};
      break;
  }
  return Posts.find({}, {sort: order, limit: limit});
});

Meteor.publish('newPosts', function(limit) {
  return Posts.find({}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('bestPosts', function(limit) {
  return Posts.find({}, {sort: {votes: -1, submitted: -1}, limit: limit});
});

Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});


Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});