serviceModule.service(
	'commonService',
	function($ionicPopup) {
	    var self = this;
	    self.monthList=['January','February','March','April','May','June',
	                    'July','August','September','October','November','December'];
	    self.showCurrentDate = function(date) {
		console.log('incoming date ' + date);
		var currentDate = date.getDate() < 10 ? '0' + date.getDate()
			: date.getDate();
		var currentMonth = date.getMonth() + 1;
		currentMonth = currentMonth < 10 ? '0' + currentMonth
			: currentMonth;
		var currentYear = date.getFullYear();
		var currentDay = date.getDay();
		return currentDate + '/' + currentMonth + '/' + currentYear;
	    };
	   self.getTotalAmount=function(expenseSet){
	    var totalAmount=0;
	    angular.forEach(expenseSet,function(expense){
		totalAmount+=expense.amount;
	    });
	    return totalAmount;
	   }; 
	   self.getMonthName=function(monthNumber){
	    return self.monthList[monthNumber-1];   
	   };
	   self.showConfirmModal= function(callback) {
		var confirmPopup = $ionicPopup.confirm({
		    title : 'Delete Expense!',
		    template : 'Are you sure?'
		});
		confirmPopup.then(callback);
	    };
	    self.showAlertModal= function(alertContent,callback) {
		var confirmPopup = $ionicPopup.alert({
		    title : alertContent.title,
		    template : alertContent.message
		});
		if(callback){
		 confirmPopup.then(callback);
		}
	    };
	});