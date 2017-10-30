serviceModule.service('chartService',function(commonService,$filter){
    var self=this;
    self.commonChartData={xAxis:[],yAxis:[]};
    self.totalAmountOnChart=0;
    self.prepareChartData=function(dataSet){
	var data=[];
	self.commonChartData={xAxis:[],yAxis:[]};
	self.totalAmountOnChart=dataSet.totalAmount;
	angular.forEach(dataSet,function(info){
	    data.push({name:info.name,y:info.amount});
	    self.commonChartData.xAxis.push(info.name);
	    self.commonChartData.yAxis.push(info.amount);
	});
	return data;
    };
    self.prepareMonthlyData=function(dataSet){
	var data=[];
	self.commonChartData={xAxis:[],yAxis:[],additionalData:[]};
	self.totalAmountOnChart=0;
	angular.forEach(dataSet,function(info){
	    data.push({name:trimDate(info.date),y:info.totalAmount});
	    self.totalAmountOnChart+=info.totalAmount;
	    self.commonChartData.additionalData.push({date:info.date,expenseSet:info.expenseSet});
	    self.commonChartData.xAxis.push(trimDate(info.date));
	    self.commonChartData.yAxis.push(info.totalAmount);
	});
	return data;	
    };
    function trimDate(date){
	var dateSet=date.split('/');
	return dateSet[0];
    }
    
    self.prepareYearlyData=function(dataSet){
	var data=[];
	if(dataSet.length){
	var selectedYear=dataSet[0].year;
	self.commonChartData={xAxis:[],yAxis:[],additionalData:[]};
	self.totalAmountOnChart=0;
	for(var month=1;month<=12;month++){
	    var filterKey=month+'_'+selectedYear;
	    var monthData=$filter('filter')(dataSet,{month_year:filterKey});
	    if(monthData.length){
	    var calculatedMonthData=calculateMonthData(monthData,month);
	    self.totalAmountOnChart+=calculatedMonthData.y;
	    console.log('calculatedMonthData '+JSON.stringify(calculatedMonthData));
	    data.push(calculatedMonthData);
	    self.commonChartData.xAxis.push(calculatedMonthData.name);
	    self.commonChartData.yAxis.push(calculatedMonthData.y);
	    }
	    console.log('data for month '+month+' = '+JSON.stringify(monthData));
	}
	}
	return data;
    };
    function calculateMonthData(monthData,monthCounter){
	var monthTotalAmount=0;
	angular.forEach(monthData,function(info){
	    monthTotalAmount+=info.totalAmount;  
	});
	return {name:commonService.getMonthName(monthCounter),y:monthTotalAmount};
    }; 
    
});