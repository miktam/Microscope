// XXX: extremely temporary!
Handlebars.registerHelper('pathFor', function(path, options) {
  return Router.path(path, this, {query: options.hash});
});