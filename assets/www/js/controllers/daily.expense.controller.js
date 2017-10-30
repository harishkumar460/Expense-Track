controllersModule.controller('dailyExpensesCtrl',function($scope,dbService,$filter,commonService,$state){
    
    var actualDate;
    $scope.expenseSet=[{id:'',name:'',amount:0,defaults:false,saved:false}];
    
    $scope.addNewExpense=function(){
	      $scope.expenseSet.push({id:'',name:'',amount:0,defaults:false,saved:false}); 
    };
    $scope.goHome=function(){
	      commonService.selectedExpenseSet=[];
	      commonService.selectedDay=''; 
	      $state.go('expenses-home');
	  };
   var showCurrentDate=function(date){
       console.log('incoming date '+date);
       var currentDate=date.getDate()<10?'0'+date.getDate():date.getDate();
       var currentMonth=date.getMonth()+1;
       currentMonth=currentMonth<10?'0'+currentMonth:currentMonth;
       var currentYear=date.getFullYear();
       var currentDay=date.getDay();
       return currentDate+'/'+currentMonth+'/'+currentYear;
   };
   
   $scope.storeExpense=function(){
       $scope.expenseSet=markSaved($scope.expenseSet);
       //dbService.storeInfo($scope.selectedDate,$scope.expenseSet);
       var data={date:$scope.selectedDate,
	         month_year:getMonthYear(actualDate),
	         expenseSet:$scope.expenseSet,
	         year:actualDate.getFullYear().toString(),
	         totalAmount:commonService.getTotalAmount($scope.expenseSet)
       };
       console.log('data input is '+JSON.stringify(data));
       dbService.openIndexDB(data,{action:'readwrite',searchBy:''},function(status){
	   if(status){
	     //filterDefaults();
	     plugins.showToast('Information saved!');    
	   }
       });
   };
   var getMonthYear=function(date){
      var month=date.getMonth()+1;
      var year=date.getFullYear();
      return month+'_'+year;
   };
   var markSaved=function(expenseSet){
      angular.forEach(expenseSet,function(expense){
	  expense.saved=true;
      }); 
      return expenseSet;
   };
   
   var checkDefaults=function(){
       var defaultsInfo=dbService.getInfo('defaultExpenses');
       defaultsInfo=defaultsInfo?JSON.parse(defaultsInfo):null;
       if(defaultsInfo && defaultsInfo.length){
	   if(!$scope.expenseSet.length){
	       $scope.expenseSet= defaultsInfo;
	   }    
       }
   };
   
   var fetchDetails=function(){
       //var existingInfo=dbService.getInfo($scope.selectedDate);
      var defaults=[];//dbService.getInfo('defaults');
      if(commonService.selectedExpenseSet.length){
	  $scope.expenseSet=angular.copy(commonService.selectedExpenseSet);
	  actualDate=new Date(angular.copy(commonService.selectedDay));
	  $scope.selectedDate=showCurrentDate(actualDate);
	  commonService.selectedExpenseSet=[];
	  commonService.selectedDay='';
	  return;
      }else if(commonService.selectedDay){
	  actualDate=new Date(angular.copy(commonService.selectedDay));
	  $scope.selectedDate=showCurrentDate(actualDate);
	  commonService.selectedDay='';
      } 
      dbService.openIndexDB($scope.selectedDate,{action:'read',searchBy:'key'},function(status,dataSet){
	 if(status){
	    console.log('dataSet '+JSON.stringify(dataSet)); 
	    // plugins.showToast('Information fetched successfully!');
	     $scope.expenseSet=dataSet && dataSet.expenseSet?dataSet.expenseSet:(defaults?defaults:[]);
	     checkDefaults();
	     $scope.$apply();
	     console.log('actual '+JSON.stringify($scope.expenseSet));
	 }else{
	     plugins.showToast('Error in data fetch operation!');
	 }
       });
   };
   
   $scope.deleteExpense=function($index){
       if($scope.expenseSet[$index].saved){
	   commonService.showConfirmModal(function(res){
	  if(res){
	      $scope.expenseSet.splice($index,1);
	      $scope.storeExpense();
	  } 
       });
       }else{
	   $scope.expenseSet.splice($index,1);   
       }
   };
   
   $scope.nextDate=function(){
       manageDates('next');
       fetchDetails();
   };
   $scope.prevDate=function(){
       manageDates('prev');
       fetchDetails();
   };
   $scope.openDatePicker=function(id){
       console.log('clicked date');
       document.getElementById(id).click();
   };
   $scope.setSelectedDay=function(){
     console.log('dom value type '+typeof document.getElementById('date-picker').value);
     console.log('dom value '+document.getElementById('date-picker').value);
     actualDate=document.getElementById('date-picker').value.toString();
     actualDate=actualDate.indexOf('-')?actualDate.replace(/-/g,'/'):actualDate;
     actualDate=new Date(actualDate);
     $scope.selectedDate=showCurrentDate(actualDate);
     fetchDetails();
   };
   
   var manageDates=function(dateType){
       var todayDate = actualDate;
       var datesInfo=getMonthDates(actualDate),newDate,newMonth,newYear;
      // var newDate=dateType==='next'?(actualDate.getDate()+1):(actualDate.getDate()-1);
       if(dateType==='next'){
	   var isLastDate=(actualDate.getDate()+1>datesInfo.lastDate);
	   var isLastMonth=(actualDate.getMonth()===11);
	   if(isLastDate){
	     newMonth=isLastMonth?0:(actualDate.getMonth()+1);
	     newYear=isLastMonth?(actualDate.getFullYear()+1):actualDate.getFullYear();
	     newDate=1;
	   }else{
	       newDate=actualDate.getDate()+1;
	       newMonth=actualDate.getMonth();
	       newYear=actualDate.getFullYear();
	   }
       }else{
	   var isFirstDate=(actualDate.getDate()-1<datesInfo.firstDate);
	   var isFirstMonth=(actualDate.getMonth()===0);
	   if(isFirstDate){
	     newMonth=isFirstMonth?11:(actualDate.getMonth()-1);
	     newYear=isFirstMonth?(actualDate.getFullYear()-1):actualDate.getFullYear();
	     newDate=getMonthDates(new Date((newMonth+1)+'/'+'01/'+newYear)).lastDate;
	   }else{
	       newDate=actualDate.getDate()-1;
	       newMonth=actualDate.getMonth();
	       newYear=actualDate.getFullYear();
	   }
       }
       todayDate.setDate(newDate);
       todayDate.setMonth(newMonth,newDate);
       todayDate.setFullYear(newYear, newMonth,newDate);
       actualDate=todayDate;
       $scope.selectedDate=showCurrentDate(todayDate);  
   };
   function getMonthDates(date){
       var y = date.getFullYear(), m = date.getMonth();
       var firstDate = new Date(y, m, 1).getDate();
       var lastDate = new Date(y, m + 1, 0).getDate();  
       return {firstDate:firstDate,lastDate:lastDate};
   }
   
   function init(){
       actualDate=new Date();
       $scope.selectedDate= showCurrentDate(actualDate);
       fetchDetails();
   }
   
   init();
});
