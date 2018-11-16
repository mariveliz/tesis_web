var app = angular.module("app", ["ngRoute", "firebase"]);

function prepareUsingModel(model_name, data) {
  var model = JSON.parse(JSON.stringify(window[model_name]));
  if(!data) return false;
  var prop;
  for(prop in data) {
    if(model.hasOwnProperty(prop)) {
      model[prop] = data[prop];
    }
  }

  return model;
}

var model_user_type = {
  id_user_type : 0,
  description : '',
};

var model_user = {
  id_user : 0,
  name : '',
  rut : '',
  password : '',
  phone_number : '',
  email : '',
  address : '',
  id_user_status : 0,
  id_user_type : 0,
  id_vehicle : 0,
};

var model_client = {
  id_client: 0,
  id_user: 0,
  name: '',
  address: '',
  rut: '',
  email: '',
  gender: 0,
  phone_number: '',
};

var model_order = {
  id_order : 0,
  id_order_status : 0,
  id_client : 0,
  request_date : 0,
  deliver_date : 0,
  total_order :0.0,
  address : '',
  latitude : '',
  longitude : '',
};

var order_status = {
  id_order_status : 0,
  name : '',
};

var model_order_detail = {
  id_order_detail : 0,
  id_product : 0,
  quantity : 0,
  id_order : 0,
  unit_price :0.0,
  total :0.0,
};

var model_order_product = {
  id_product : 0,
  description : '',
  price :0.0,
  image : '',
};

var model_route = {
  id_route : 0,
  creation_date : 0,
  id_vehicle : 0,
  id_user : 0,
  total_distance : '',
  start_time : 0,
  end_time : 0,
};

var model_route_leg = {
  id_route_leg : 0,
  id_route: 0,
  id_order : 0,
  latitude : '',
  longitude : '',
  start_time : 0,
  start_latitude : '',
  start_longitude : '',
  status : '',
};

var model_vehicle = {
  id_vehicle : 0,
  patent_plate : '',
  type : '',
};

var model_vehicle_position = {
  id_vehicle_position : 0,
  latitude : '',
  longitude : '',
  date : 0,
  id_vehicle : 0,
};

var fireconfig = {
  apiKey: "AIzaSyAUUrBV3sfwmawE63FJ_a6rluY-S-1pZRw",
  authDomain: "awesome-8afc3.firebaseapp.com",
  databaseURL: "https://awesome-8afc3.firebaseio.com",
  projectId: "awesome-8afc3",
  storageBucket: "awesome-8afc3.appspot.com",
  messagingSenderId: "623237833786"
};

app.config(function($routeProvider) {

  firebase.initializeApp(fireconfig);


  $routeProvider
    .when("/", {
      templateUrl : "Package/main.html",
      auth: true
    })
    .when("/login", {
      templateUrl : "Package/login.html"
    })
    .when("/client", {
      templateUrl : "Package/client.html",
      controller: 'clientCtrl as vm',
      auth: true
    })
    ;

});

app.run(function($location, $rootScope, $route, Auth) {
  $rootScope.$on("$includeContentLoaded", function(event, templateName){
    if(templateName == 'Package/fragment/open.html')
     init();
  });

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
      //init();
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
  };

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

app.controller("clientCtrl",
  function($scope, $routeParams, $firebaseObject, $firebaseArray) {
    this.model = 'model_client';
    this.collection = 'client';
    var ref = firebase.database().ref().child(this.collection);

    this.document = $firebaseArray(ref);

    this.add = function(data) {
      console.log(data);
      this.document.$add(data);
    };
  }
);

app.controller("formCtrl",
  function($scope, $firebaseStorage, $firebaseObject) {
    var vm = this;
    this.formData = {};

    this.submit = function(parent) {
      var form = prepareUsingModel(parent.model, this.formData);
      parent.add(form);
      //var ref = firebase.database().ref(fireconfig.databaseURL + '/' + parent.collection);
      //ref.$set(form);
      /*
      var sync = $firebase(ref);
      sync.$set(form);
      */
    };
  }
);

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
