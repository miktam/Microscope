Template.postsList.helpers({
  hasMorePosts: function(){
    // as long as we ask for N posts and all N posts showed up, then keep showing the "load more" button
    return Router.current().limit() == this.count();
  },
  loadMorePath: function () {
    return Router.current().nextPath();
  }
});
