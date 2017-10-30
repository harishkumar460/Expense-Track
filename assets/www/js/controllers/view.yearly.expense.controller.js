controllersModule.controller('viewYearExpensesCtrl',function($scope,commonService,dbService,$state,chartService){
    var yearList=[];
    var createYearList=function(year){
	  if(year<=2099){  
	  yearList.push(year+1);
	  createYearList(year+1);
	  }else{
	    $scope.yearRange=yearList;  
	  }  
    };
    $scope.goHome=function(){
	       console.log('go to home');
	       $state.go('expenses-home');
	   };
    $scope.changeYear=function(year){
	$scope.selectedYear=year;
	$scope.totalAmount=0;
	$scope.chartOptions={name:"Expenses",title:"",toolTipText:'Month:'};
	fetchDetails($scope.selectedYear);  
    };
    function init(){
	$scope.yearRange=[];
	createYearList(1980);
	$scope.selectedYear=new Date().getFullYear().toString();
	$scope.totalAmount=0;
	$scope.chartOptions={name:"Expenses",title:"",toolTipText:'Month:'};
	fetchDetails($scope.selectedYear);  
    }
    
    var fetchDetails=function(selectedYear){
	       dbService.openIndexDB(selectedYear,{action:'read',searchBy:'index'},function(status,dataSet){
	 	 if(status){
	 	    console.log('actual '+JSON.stringify(dataSet));
	 	     $scope.totalAmount=0;
	 	    chartService.commonChartData={};
	 	     $scope.chartData=chartService.prepareYearlyData(dataSet);
	 	     $scope.expenseSet=$scope.chartData;
	 	     $scope.commonChartData=chartService.commonChartData;
	 	     console.log('chart data '+JSON.stringify($scope.chartData));
	 	     console.log('common chart data '+JSON.stringify($scope.commonChartData));
	 	     $scope.totalAmount=chartService.totalAmountOnChart;
	 	     console.log('$scope.chartView '+$scope.chartView+' from service '+chartService.totalAmountOnChart+' actual total '+$scope.totalAmount);
	 	     $scope.noRecordsFound=$scope.expenseSet.length<1;
	 	     $scope.$apply();
	 	 }else{
	 	     plugins.showToast('Error in data fetch operation!');
	 	 }
	       });
	   };
    
    init();
});
