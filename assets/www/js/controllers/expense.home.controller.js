var controllersModule=angular.module('starter.controllers',[])
.controller('expenseHomeCtrl', function($scope,$state,dbService,commonService) {
    
    $scope.proceed=function(stateName){
     $state.go(stateName); 
   };
   $scope.validateSecurePin=function(){
     if($scope.secureAccess.securePin.length<4){
      return;	 
     }
     var getCurrentPin=dbService.getInfo('securePin');
     if(getCurrentPin && $scope.secureAccess.securePin && getCurrentPin.newPin===$scope.secureAccess.securePin ){
	 $scope.proceed('expenses-home'); 
      }else{
	  commonService.showAlertModal({title:'Pin verfication failed!',
			message:'Please enter correct pin'});
	  $scope.secureAccess.securePin='';
      }
   };
   function checkSecureAccess(){
       var getSecurePinStatus=dbService.getInfo('securePinStatus');
       var getCurrentPin=dbService.getInfo('securePin');	
       if(getSecurePinStatus && getSecurePinStatus.status==='enabled' && getCurrentPin){
	   if(!commonService.secureLoggedIn){
	     commonService.secureLoggedIn=true;
	     $scope.proceed('secure-pin');   
	   } 
       }
   }
   function init(){
       $scope.secureAccess={};
       dbService.createDatabase();
       commonService.selectedExpenseSet=[];
       checkSecureAccess();
   }
   init();
   
});
