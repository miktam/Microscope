var postsIncrement = 5;

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  postLimit: function() { 
    return parseInt(this.params.postLimit) || postsIncrement; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postLimit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions()),
      nextPath: this.nextPath()
    };
  }
});

NewPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postLimit: this.postLimit() + postsIncrement});
  }
});

BestPostsListController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postLimit: this.postLimit() + postsIncrement});
  }
});

Router.map(function() {
  this.route('home', {
    path: '/',
    controller: NewPostsListController
  });
  
  this.route('newPosts', {
    path: '/new/:postLimit?',
    controller: NewPostsListController
  });
  
  this.route('bestPosts', {
    path: '/best/:postLimit?',
    controller: BestPostsListController
  });
  
  this.route('postPage', {
    path: '/posts/:_id',
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
    path: '/submit',
    disableProgress : true
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