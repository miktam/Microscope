Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  limit: function() { 
    return parseInt(this.params.limit) || 3; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    postsView = 'new';
    return Meteor.subscribe('posts', postsView, this.limit());
  },
  data: function() {
    return Posts.find({}, this.findOptions());
  },
  nextPath: function() {
    return this.route.path({limit: this.limit() + 3});
  }
});

NewPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1}
});

BestPostsListController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1}
});

Router.map(function() {
  this.route('home', {
    path: '/',
    controller: NewPostsListController
  });
  
  this.route('newPosts', {
    path: '/new/:limit?',
    controller: NewPostsListController
  });
  
  this.route('bestPosts', {
    path: '/best/:limit?',
    controller: BestPostsListController
  });
  
  this.route('postPage', {
    path: '/posts/:_id',
    template: 'postsList',
    data: function() { return Posts.findOne(this.params._id); },
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    }
  });

  this.route('postEdit', {
    path: '/posts/:_id/edit',
    data: function() { return Posts.findOne(this.params._id); },
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    }
  });
  
  this.route('postSubmit', {
    path: '/submit'
  });
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    
    this.stop();
  }
}

Router.before(requireLogin, {only: 'postSubmit'})
Router.before(function() { clearErrors() });