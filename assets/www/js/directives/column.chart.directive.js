directiveModule.directive('columnChart',function(chartService){
    return {
	restrict:'E',
	template:'<p ng-if="isDrilled"><a href="" ng-click="drillUp()"><i class="icon ion-arrow-graph-up-right font-hi m-l-10"></i></a></p><div id="container1" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto;margin-top:20px;"></div>',
	scope:{
	    chartData:'=',
	    options:'='
	},
	link:function(scope,elem,attrs){
	    var chart,startTime,backupData,oldIndex,backupOptions;
	    scope.drillUp=function(){
	      scope.chartData=backupData;
	      scope.options=backupOptions;
	      scope.isDrilled=false;
		  drawChart();
	    }
	    function drawChart(){
	    chart=Highcharts.chart('container1', {
	        chart: {
	            type:scope.options.type
	        },
	        title: {
	            text: scope.options.title
	        },
	        xAxis: {
	            categories:scope.chartData.xAxis
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Expenses (Rs.)'
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">'+scope.options.toolTipText+'{point.key}</span><br/><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">Amount: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: false,
	            useHTML: false
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.1,
	                borderWidth: 0,
	                dataLabels: {
	                    enabled: true
	                }
	            },
	            bar:{
	        	dataLabels: {
	                    enabled: true
	                }
	            },
	            line:{
	        	dataLabels: {
	                    enabled: true
	                }	
	            },
	            series:{
	        	point:{
	        	 events:{
	        	   click:function(e){
	        	       if(startTime){
	        		var newTime=new Date().getTime();
	        		var diff=(newTime-startTime)/1000;
	        		if(diff<5 && oldIndex===e.point.x){
	        		    /*alert('Double click -Category: ' + this.category + ', value: ' + this.y+' index '+e.point.x);*/ 
	        		  if(scope.chartData.additionalData){
	        		      backupData=scope.chartData;
	        		      backupOptions=angular.copy(scope.options);
	        		      
	        		  chartService.prepareChartData(scope.chartData.additionalData[e.point.x].expenseSet);
	        		  scope.chartData=chartService.commonChartData;
	        		  scope.options.toolTipText="Expense:";
	        		  drawChart();
	        		  scope.isDrilled=true;
	        		  oldIndex=null;
	        		  scope.$apply();
	        		  }
	        		}
	        		startTime=null;
	        		oldIndex=e.point.x;
	        	       }else{
	        		   startTime=new Date().getTime();
	        		   oldIndex=e.point.x;
	        	       }
	        	   }
	        	 }   
	        	}
	            }
	        },
	        series: [{
	            name: 'Expenses',
	            data: scope.chartData.yAxis

	        }]
	    });
	    } 
	 drawChart();
	    scope.$watchGroup(['options.type','chartData'],function(){
		console.log('Chart info updated '+JSON.stringify(scope.options));
		if(chart){
		 drawChart();   
		}
	    });
	    
	}
    };
});
