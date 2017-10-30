controllersModule.controller('monthlyDashboardCtrl',function($scope,dbService,chartService,$state){
    $scope.cView={isActive:false};
    function init(){
    $scope.selectedMonth=new Date();
    $scope.totalAmount=0;
    $scope.chartOptions={name:"Expenses",title:"",toolTipText:'Date:'};
    fetchDetails($scope.selectedMonth);   
   }
    function formatMonth(date){
	return ((date.getMonth()+1)+'_'+date.getFullYear());
    }
   var fetchDetails=function(selectedMonth){
       dbService.openIndexDB(formatMonth(selectedMonth),{action:'read',searchBy:'index'},function(status,dataSet){
 	 if(status){
 	     $scope.expenseSet=dataSet?dataSet:[];
 	     $scope.totalAmount=0;
 	     $scope.chartData=chartService.prepareMonthlyData($scope.expenseSet);
 	     $scope.commonChartData=chartService.commonChartData;
 	     $scope.totalAmount=chartService.totalAmountOnChart;
 	     console.log('chart data '+JSON.stringify($scope.chartData));
 	     console.log('common chart data '+JSON.stringify($scope.commonChartData));
 	     $scope.noRecordsFound=$scope.expenseSet.length<1;
 	     console.log('actual '+JSON.stringify($scope.expenseSet));
 	     stopWatch=false;
 	     $scope.$apply();
 	 }else{
 	     plugins.showToast('Error in data fetch operation!');
 	 }
       });
   };
   $scope.changeMonth=function(selectedMonth){
     console.log('Selected month '+selectedMonth); 
     fetchDetails(selectedMonth);
   };
   $scope.goHome=function(){
       console.log('go to home');
       $state.go('expenses-home');
   };
   $scope.$watch('cView.isActive',function(){
       console.log('cView updated '+$scope.cView.isActive);
      $scope.chartView=$scope.cView.isActive; 
   });
   init();
});
