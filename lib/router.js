Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  waitOn: function() {
    postsLimit = parseInt(this.params.limit) || 3;
    postsView = getView(this.path);
    return Meteor.subscribe('posts', postsView, postsLimit);
  },  
  data: function() {
    return Posts.find({}, getParameters(postsView, postsLimit));
  }
});

Router.map(function() {
  this.route('home', {
    path: '/',
    controller: PostsListController
  });
  
  this.route('newPosts', {
    path: '/new/:limit?',
    controller: PostsListController
  });
  
  this.route('bestPosts', {
    path: '/best/:limit?',
    controller: PostsListController
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

getView = function(path) {
  if(path == '/' || path.search('new') != -1)
    return 'new';
  if(path.search('best') != -1)
    return 'best';
}

getParameters = function(view, limit) {
  var parameters = {};

  switch(view){
    case 'new':
      parameters.sort = {submitted: -1, _id: -1};
      break;
    case 'best':
      parameters.sort = {votes: -1, submitted: -1, _id: -1};
      break;
  }

  parameters.limit = limit;

  return parameters;
}