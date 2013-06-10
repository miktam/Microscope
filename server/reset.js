      Meteor.setInterval(function() {
        
        // reset
        if (typeof(Posts) !== 'undefined') Posts.remove({}, {multi: true});
        if (typeof(Comments) !== 'undefined') Comments.remove({}, {multi: true});
        if (typeof(Notifications) !== 'undefined') Notifications.remove({}, {multi: true});
          
if (Posts.find().count() === 0) {
  Posts.insert({
    title: 'Introducing Telescope',
    author: 'Sacha Greif',
    url: 'http://sachagreif.com/introducing-telescope/'
  });
  
  Posts.insert({
    title: 'Meteor',
    author: 'Tom Coleman',
    url: 'http://meteor.com'
  });
  
  Posts.insert({
    title: 'The Meteor Book',
    author: 'Tom Coleman',
    url: 'http://themeteorbook.com'
  });
}      
      }, 24 * 3600 * 1000); // every day
