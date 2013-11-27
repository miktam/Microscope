Template.postsList.helpers({
  postsWithRank: function() {
    this.posts.rewind();
    return this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  },
  hasMorePosts: function(){
    // as long as we ask for N posts and all N posts showed up, then keep showing the "load more" button
    return Router.current().limit() == this.posts.count();
  }
});
