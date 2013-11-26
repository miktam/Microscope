Template.postsList.helpers({
  postsWithRank: function() {
    return this.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  },
  hasMorePosts: function(){
    // as long as we ask for N posts and all N posts showed up, then keep showing the "load more" button
    return Session.get('postsLimit') == this.count();
  },
  loadMoreUrl: function () {
    var count = Session.get('postsLimit') + 3;
    return '/' + Session.get('view') + '/' + count;
  }
});