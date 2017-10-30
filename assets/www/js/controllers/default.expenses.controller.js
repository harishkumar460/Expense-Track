controllersModule.controller('defaultExpensesCtrl', function($scope, $state,
	dbService,commonService) {
    var defaultRecord={
	    id : '',
	    name : '',
	    amount : 0,
	    defaults : false,
	    saved : false
	};
    $scope.goHome = function() {
	console.log('go to home');
	$state.go('expenses-home');
    };
    $scope.addMore = function() {
	$scope.expenseSet.push(angular.copy(defaultRecord));
    };
    $scope.saveDefaults = function() {
	$scope.expenseSet=markSaved($scope.expenseSet);
	var info=JSON.stringify($scope.expenseSet);
	dbService.storeInfo('defaultExpenses',info);
	plugins.showToast('Information saved!');  
    };
    var markSaved=function(expenseSet){
	      angular.forEach(expenseSet,function(expense){
		  expense.saved=true;
		  expense.defaults=true;
	      }); 
	      return expenseSet;
	   };
    $scope.deleteExpense = function($index) {
	if ($scope.expenseSet[$index].saved) {
	    commonService.showConfirmModal(function(res) {
		if (res) {
		    $scope.expenseSet.splice($index, 1);
		    $scope.saveDefaults();
		}
	    });
	} else {
	    $scope.expenseSet.splice($index, 1);
	}
    };
    
    var fetchDetails=function(){
	var infoDetails=dbService.getInfo('defaultExpenses');
	console.log('infoDetails '+infoDetails);
	$scope.expenseSet=infoDetails?JSON.parse(infoDetails):[angular.copy(defaultRecord)];
    };
    function init() {
	fetchDetails();
    }
    init();
});
