Deps.autorun(function(){
  if (Meteor.user() && !Meteor.loggingIn()) {
    var intercomSettings = {
      email: Meteor.user().emails[0].address,
      created_at: Math.round(Meteor.user().createdAt/1000),
      user_name: Meteor.user().username,
      user_id: Meteor.user()._id,
      user_hash: Meteor.user().intercomHash,
      app_id: "k20iexvc"
    };
    Intercom('boot', intercomSettings);
  }
});
