Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'newPosts'
  });
  
  this.route('newPosts', {
    path: '/new/:limit?',
    template: 'postsList',
    waitOn: function() {
      limit = parseInt(this.params.limit) || 3;
      Session.set('postsLimit', limit);
      Session.set('view', 'new');
      return Meteor.subscribe('posts', 'new', limit);
    },
    data: function() {
      return Posts.find({}, {sort: {submitted: -1, _id: -1}, limit: limit});
    }
  });
  
  this.route('bestPosts', {
    path: '/best/:limit?',
    template: 'postsList',
    waitOn: function() {
      limit = parseInt(this.params.limit) || 3;
      Session.set('postsLimit', limit);
      Session.set('view', 'best');
      return Meteor.subscribe('posts', 'best', limit);
    },
    data: function() {
      return Posts.find({}, {sort: {votes: -1, submitted: -1, _id: -1}, limit: limit});
    }
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