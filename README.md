Ionic App Base utilizing Firebase database

=====================

A starting project for Ionic that optionally supports using custom SCSS.

## Using this project

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ npm install -g ionic
```

Then run:

```bash
$ ionic start myProject blank
$ cd myProject/
$ ionic hooks add
$ ionic platform add ios
$ ionic platform add android
$ ionic serve --lab
```

## Firebase
Setup a [Firebase Account](https://www.firebase.com/)

Tutorial [Using Ionic with Firebase](https://www.firebase.com/docs/web/libraries/ionic/guide.html)

Video Tutorial [Build a Cross-Platform App with Ionic](https://www.youtube.com/watch?v=zj8ZFV9vv9k)

Include the Firebase and AngularFire libraries as dependencies in our `index.html` file, right before our `app.js` include.

```html
<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.2.4/firebase.js"></script>

<!-- AngularFire -->
<script src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script>
```

In the `app.js` file we need to add firebase as a dependency in our application module:

```javascript
angular.module("starter", ["ionic", "firebase"])
```
Ready now to store and sync data with AngularFire using `$firebaseArray`, `$firebaseObject`, and `$firebaseAuth`.

#### Add a List viewport

Let's build a simple grocery list app. We manage the grocery list and connect the Firebase database into the app inside of the `ListCtrl` controller. The controller code can be found inside `app.js`.

The `<ion-header-bar>` is a directive provided by Ionic. It creates a mobile-friendly navigation menu. For now, it just contains a button for adding groceries to the list, which will invoke the `addItem()` method inside `ListCtrl`. The css class `ion-plus` will create a plus sign button using Ionic's Ionicon library.

```html
<body ng-app="starter" ng-controller="ListCtrl">
    <ion-header-bar class="top">
      <h1 class="title">Items</h1>
      <button class="button button-icon ion-plus" ng-click="addItem()">
      </button>
    </ion-header-bar>
</body>
```
Ionic provides some handy tools for dealing with lists: `<ion-list>` and `<ion-item>`. We'll nest those inside an `<ion-content>` directive to indicate that this is the main body of the view. These may look familiar if you're familiar with table cells or list items in mobile.

```html
<ion-content>
  <ion-list>
    <ion-item ng-repeat="item in items" ng-class="{purchased: item.status == 'purchased'}">
      {{item.name}} - {{item.price}}
      <ion-option-button class="button-royal" ng-click="purchaseItem(item)">
        <i class="icon ion-checkmark"></i>
      </ion-option-button>
    </ion-item>
  </ion-list>
</ion-content>
```
The ng-class will apply the .purchased CSS class to the item when called via ng-click.

```css
.purchased {
  color: #9E9E9E;
  text-decoration:  line-through;
}

```

Now that we have a UI for adding items to our list, we'll write a function to save our list items to our database using the `$firebaseArray` service.

#### Saving & Updating Data

To save data, we'll create an Items factory that uses `$firebaseArray`, a service provided by the AngularFire library to synchronize our local Angular array with our remote data:

```javascript
.factory("Items", function($firebaseArray) {
  var itemsRef = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com/items");
  return $firebaseArray(itemsRef);
})
```
Now we can create our `ListCtrl` and inject our `Items` factory as a dependency:

```javascript
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
    var itemsRef = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com/items/"/ + item.$id);
    //$scope.item['status'] = 'purchased';
    itemsRef.child('status').set('purchased');
    $ionicListDelegate.closeOptionButtons();
  };
```
This shows the user a prompt to add a new grocery item, and then we use AngularFire's `$add` function to add the item to our synchronized array. Now when we add items, they'll be stored under a unique ID generated in the database. Purchased items will be updated in the synchronized array and database.
