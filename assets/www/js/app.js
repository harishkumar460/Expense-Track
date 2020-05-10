// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.services','starter.directives','starter.controllers','ngCordova.plugins.file'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
    //  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	
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
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('monthly-dashboard', {
      url: "/monthly-dashboard",
      templateUrl: "./views/monthly-dashboard.html",
      controller: 'viewMonthlyExpensesCtrl'
    })
    .state('view-yearly-dashboard', {
      url: "/yearly-dashboard",
      templateUrl: "./views/yearly-dashboard.html",
      controller: 'viewYearExpensesCtrl'
    })
    .state('expenses-settings', {
      url: "/expenses-settings",
      templateUrl: "./views/expenses-settings.html",
      controller: 'expensesSettingsCtrl'
    })
    .state('backup-expenses', {
      url: "/backup-expenses",
      templateUrl: "./views/backup-expenses.html",
      controller: 'expensesSettingsCtrl'
    })
    .state('secure-access', {
      url: "/secure-access",
      templateUrl: "./views/secure-pin-settings.html",
      controller: 'expensesSettingsCtrl'
    })
    .state('manage-defaults', {
      url: "/manage-defaults",
      templateUrl: "./views/manage-defaults-expenses.html",
      controller: 'defaultExpensesCtrl'
    })
    .state('expenses-home', {
      cache:false,
      url: "/expenses-home",
      templateUrl: "./views/expenses-home.html",
      controller: 'expenseHomeCtrl'
    })
    .state('secure-pin', {
      cache:false,
      url: "/secure-pin",
      templateUrl: "./views/secure-pin.html",
      controller: 'expenseHomeCtrl'
    })
    .state('edit-view-daily-expenses', {
	      cache:false,
	      url: "/edit-view-daily-expenses",
	      templateUrl: "./views/edit-view-daily-expenses.html",
	      controller: 'dailyExpensesCtrl'
     })
     .state('view-monthly-expenses', {
	      cache:false,
	      url: "/view-monthly-expenses",
	      templateUrl: "./views/view-monthly-expenses.html",
	      controller: 'viewMonthlyExpensesCtrl'
     })
     .state('view-monthly-dashboard', {
	      cache:false,
	      url: "/view-monthly-dashboard",
	      templateUrl: "./views/monthly-dashboard.html",
	      controller: 'monthlyDashboardCtrl'
     });
   $urlRouterProvider.otherwise("/expenses-home");

})
//////////////////// dummy sample for response from native
/*$scope.callPlugin=function(){
	plugins.callPlugin(function(msg){
	console.log('message from android '+msg);    
	},function(err){
	    console.log('error from android '+err);
	},"TestPlugin", "showMessage",[]);	
};*/
