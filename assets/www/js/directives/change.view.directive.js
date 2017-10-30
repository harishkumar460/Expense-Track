directiveModule.directive('changeView',function(){
    return {
	restrict:'AE',
	scope:{
	chartView:'=',
	chartOptions:'=',
	customType:'=',
	chartOptions:'=',
	cView:'='
	},
	templateUrl:'../www/views/change-view-template.html',
	link:function(scope,elem,attrs){
	    scope.dataView='List';
	    scope.chartType='Pie';
	    scope.toggleView=function(dataView){
	      scope.chartView=(dataView==='Chart');
	      if(scope.cView){
	      scope.cView.isActive=scope.chartView;
	      }
	      console.log('updated chart view '+scope.chartView);
	      scope.totalAmount=!scope.chartView?0:scope.totalAmount;
	    
	    };
           scope.changeChartView=function(chartView){
	      scope.chartOptions.type=chartView.toLowerCase();
	      scope.customType=(chartView==='Column' || chartView==='Bar' || chartView==='Line'); 
	  }; 	  
	}
    }
});