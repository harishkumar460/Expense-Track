var controllersModule=angular.module('starter.controllers',[])
.controller('expenseHomeCtrl', function($scope,$state,dbService,commonService) {
    
    $scope.proceed=function(stateName){
     $state.go(stateName); 
   };
   function init(){
       dbService.createDatabase();
       commonService.selectedExpenseSet=[];
   }
   init();
   
});
