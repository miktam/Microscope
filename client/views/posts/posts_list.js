Template.postsList.helpers({
  hasMorePosts: function(){
    return Router.current().limit() == this.posts.fetch().length;
  }
});
