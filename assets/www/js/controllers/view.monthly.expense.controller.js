controllersModule.controller('viewMonthlyExpensesCtrl', function($scope,commonService,dbService,$state,chartService) {
    $scope.updated={day:''};
    $scope.cView={isActive:false};
    $scope.openMonthPicker=function(id){
       console.log('clicked month');
       document.getElementById(id).click();
   };
   $scope.$watch('cView.isActive',function(){
       console.log('cView updated '+$scope.cView.isActive);
      $scope.chartView=$scope.cView.isActive; 
   });
   $scope.$watch('updated.day',function(){
       console.log('updated '+$scope.updated.day);
       $scope.day=$scope.updated.day?$scope.updated.day:$scope.day;
       $scope.totalAmount=0;
       commonService.selectedExpenseSet=[];
       commonService.selectedDay='';
       fetchInfo();
   });
   
   var fetchDetails=function(){
       dbService.openIndexDB($scope.selectedDate,{action:'read',searchBy:'key'},function(status,dataSet){
 	 if(status){
 	     $scope.expenseSet=dataSet && dataSet.expenseSet?dataSet.expenseSet:[];
 	     $scope.totalAmount=dataSet?dataSet.totalAmount:0;
 	     $scope.chartData=chartService.prepareChartData($scope.expenseSet);
 	     $scope.commonChartData=chartService.commonChartData;
 	     console.log('chart data '+JSON.stringify($scope.chartData));
 	     console.log('common chart data '+JSON.stringify($scope.commonChartData));
 	     $scope.noRecordsFound=$scope.expenseSet.length<1;
 	     $scope.$apply();
 	     console.log('actual '+JSON.stringify($scope.expenseSet));
 	 }else{
 	     plugins.showToast('Error in data fetch operation!');
 	 }
       });
   };
   $scope.getTotalAmount=function(expenseAmount){
       $scope.totalAmount+=expenseAmount;  
   };
   $scope.editExpense=function(){
       commonService.selectedExpenseSet=$scope.expenseSet;
       commonService.selectedDay=$scope.day;
       $state.go('edit-view-daily-expenses');
   };
   $scope.addNewExpense=function(){
       commonService.selectedDay=$scope.day;
       commonService.selectedExpenseSet=[];
       $state.go('edit-view-daily-expenses');  
   };
   $scope.goHome=function(){
       console.log('go to home');
       commonService.selectedExpenseSet=[];
       commonService.selectedDay=''; 
       $state.go('expenses-home');
   };
   function init(){
       $scope.day = moment(); 
       $scope.totalAmount=0;
       $scope.noRecordsFound=false;
       $scope.chartView=false;
       $scope.chartOptions={name:"Expenses",title:""};
      // fetchInfo();
   }
   function fetchInfo(){
       $scope.selectedDate=commonService.showCurrentDate(new Date($scope.day));
       fetchDetails();    
   }
   init();
 });
