// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', "firebase"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory("Items", function($firebaseArray) {
  // var itemsRef = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com/items");
  var itemsRef = new Firebase("https://blistering-fire-4944.firebaseio.com/items");
  return $firebaseArray(itemsRef);
})

.controller("ListCtrl", function($scope, $ionicListDelegate, Items) {

  $scope.items = Items;

  // Add items to Items array and Firebase
  $scope.addItem = function() {
    var name = prompt("What do you need to buy?");
    var price = prompt("What is the price?");
    if (name, price) {
      $scope.items.$add({
        "name": name,
        "price": price
      });
    }
  };

  // Updates item to Items array and Firebase
  $scope.purchaseItem = function(item) {
    //$scope.item = item;
    var itemsRef = new Firebase("https://blistering-fire-4944.firebaseio.com/items/" + item.$id);
    //$scope.item['status'] = 'purchased';
    itemsRef.child('status').set('purchased');
    $ionicListDelegate.closeOptionButtons();
  };

});
