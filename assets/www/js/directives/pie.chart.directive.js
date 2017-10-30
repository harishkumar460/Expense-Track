var directiveModule=angular.module('starter.directives',[]).directive('pieChart',function(chartService){
    return {
	restrict:'E',
	template:'<div id="container" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto;margin-top:20px;"></div>',
	scope:{
	    chartData:'=',
	    options:'='
	},
	link:function(scope,elem,attrs){
	    var startTime;
	    function drawChart(){
	    Highcharts.chart('container', {
	            chart: {
	                plotBackgroundColor: null,
	                plotBorderWidth: null,
	                plotShadow: false,
	                type: 'pie'
	            },
	            title: {
	                text: scope.options.title
	            },
	            tooltip: {
	        	headerFormat:scope.options.toolTipText+'{point.name}<br/>',
	                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	            },
	            plotOptions: {
	                pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    dataLabels: {
	                        enabled: false
	                    },
	                    showInLegend: true
	                },
	                series:{
		        	point:{
		        	 events:{
		        	   click:function(e){
		        	       if(startTime){
			        		var newTime=new Date().getTime();
			        		var diff=(newTime-startTime)/1000;
			        	if(diff<5){
			        	    alert('Sorry! Currently Drill feature is not available in pie chart. ')
			        	}
			        	startTime=null;
		        	       }else{
		        		   startTime=new Date().getTime();   
		        	       }	
		        	    }
		        	   }
		        	}
	                }
	            },
	            series: [{
	                name: scope.options.name,
	                colorByPoint: true,
	                data:scope.chartData
	            }]
	        });
	    }
	    drawChart();
	    scope.$watch('chartData',function(){
		console.log('pie chart data update watched');
	      drawChart();
	    });
	}
    };
});
