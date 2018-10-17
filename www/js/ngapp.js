var app = angular.module("app", ["ngRoute", "firebase"]);

console.log(app);
app.config(function($routeProvider) {

  var fireconfig = {
    apiKey: "AIzaSyAUUrBV3sfwmawE63FJ_a6rluY-S-1pZRw",
    authDomain: "awesome-8afc3.firebaseapp.com",
    databaseURL: "https://awesome-8afc3.firebaseio.com",
    projectId: "awesome-8afc3",
    storageBucket: "awesome-8afc3.appspot.com",
    messagingSenderId: "623237833786"
  };
  firebase.initializeApp(fireconfig);


  $routeProvider
    .when("/", {
      templateUrl : "Package/main.html",
      auth: true
    })
    .when("/login", {
      templateUrl : "Package/login.html"
    })
    ;

});

app.run(function($location, $rootScope, $route, Auth) {

  $rootScope.$on('$locationChangeStart', function(evt, next, current) {
    var nextPath = $location.path(),
      nextRoute = $route.routes[nextPath];
    if (nextRoute && nextRoute.auth && !Auth.$getAuth()) {
      $location.path("/login");
    }
  });

  $rootScope.$on('$viewContentLoaded', function() {
    var path = $location.path();
    if(path != '/login' && Auth.$getAuth()){
      init();
    }
  });


});

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.service('UserService', function($rootScope) {
  this.email       = '';
  this.info        = {};
  this.displayName = '';
  this.email       = '';
  this.uid         = '';

  this.set = function(data) {
    if(data) {
      this.info         = data;
      this.email        = data.email;
      this.displayName  = data.displayName;
      this.uid          = data.uid;
    }
  };

  this.get = function() {
    if($rootScope.user)
      $rootScope.user = {};
    return $rootScope.user;
  }

});


app.controller("authCtrl", ["$scope", "Auth",
  function($scope, Auth) {

    this.signIn = function(data, callback) {
      this.error = null;

        Auth.$signInWithEmailAndPassword(data.email, data.password)
        .then(function(firebaseUser) {
          this.user = firebaseUser;
          console.log('ye');
        }).catch(function(error) {
          this.error = error;
        });
    };

    this.signOut = function()  {
      console.log('that');
      Auth.$signOut();
    };
  }
]);

app.controller("loginCtrl", ["$scope",
  function($scope) {
    this.info = {};
  }
]);


app.controller("mainCtrl", function($scope, Auth, UserService, $location) {
  var vm = this;
  this.title        = "Manantial de dulzura";
  this.pageTitle    = "Dashboard";
  this.welcome      = "Hola,";
  this.firstName    = "Admin";
  this.lastName     = "Strator";
  this.user         = UserService;

  var offAuth = Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
      //this.user = firebaseUser;
      vm.user.set(firebaseUser);
      $location.path('/').replace();
      setTimeout(function(){
        //offAuth();
      }, 300);
    } else {
      console.log('bad sign');
      $location.path('/login').replace();
    }
  })
  ;

});
