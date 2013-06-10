(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/errors/errors_tests.js                                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Tinytest.add("Errors collection works", function(test) {             // 1
  test.equal(Errors.collection.find({}).count(), 0);                 // 2
                                                                     // 3
  Errors.throw('A new error!');                                      // 4
  test.equal(Errors.collection.find({}).count(), 1);                 // 5
                                                                     // 6
  Errors.collection.remove({});                                      // 7
});                                                                  // 8
                                                                     // 9
Tinytest.addAsync("Errors template works", function(test, done) {    // 10
  Errors.throw('A new error!');                                      // 11
  test.equal(Errors.collection.find({seen: false}).count(), 1);      // 12
                                                                     // 13
  // render the template                                             // 14
  OnscreenDiv(Spark.render(function() {                              // 15
    return Template.meteorErrors();                                  // 16
  }));                                                               // 17
                                                                     // 18
  // wait a few milliseconds                                         // 19
  Meteor.setTimeout(function() {                                     // 20
    test.equal(Errors.collection.find({seen: false}).count(), 0);    // 21
    test.equal(Errors.collection.find({}).count(), 1);               // 22
    Errors.clear();                                                  // 23
                                                                     // 24
    test.equal(Errors.collection.find({seen: true}).count(), 0);     // 25
    done();                                                          // 26
  }, 500);                                                           // 27
});                                                                  // 28
                                                                     // 29
///////////////////////////////////////////////////////////////////////

}).call(this);
