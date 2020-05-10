serviceModule.service('ReportBuilderSvc', reportBuilderService);
    
	function reportBuilderService(commonService) {
        var self = this;
        self.reportData={
        	fileName:'Expense_Report',
        	mainHeader:'Expense Report | July,2017',
        	totalAmount:0,
        	columns:['date','count','totalAmount'],
        	defaultHeader:[{text: 'Date',style: 'tableHeader'},
                               {text: 'Expense Count',style: 'tableHeader'},
                               {text: 'Expense Amount',style: 'tableHeader'}
                               ],
        	pageBreak:'',//use string 'after' for page break
        	reportContent:[]
        };
        
        self.buildReport=function(dataSet,briefReport){
            self.reportData.reportContent=[];
            var periodInfo=getFormattedPeriod(dataSet[0].month_year);
           self.reportData.fileName='Expense_Report_'+dataSet[0].month_year;
           self.reportData.mainHeader='Expense Report | '+periodInfo;
           if(briefReport){
            createReport(dataSet);
           }else{
            buildDetailedReport(dataSet);   
           }
        };
        
        function createReport(dataSet){
            self.reportData.totalAmount='Consolidated Total Amount : '+calculateTotalAmount(dataSet);
            //self.reportData.pageBreak=dataSet.length>=30?'after':'';
              self.reportData.reportContent.push(self.reportData.defaultHeader);
              angular.forEach(dataSet,function(dataRecord){
                 var recordRow=[];
                 angular.forEach(self.reportData.columns,function(column){
                     console.log('dataRecord.expenseSet '+dataRecord.expenseSet);
           	  recordRow.push({text:(column==='count'?dataRecord.expenseSet.length:dataRecord[column])+'',style:'tableHeader'});  
                 });
                 self.reportData.reportContent.push(recordRow);
              });
              console.log('Report data is '+JSON.stringify(self.reportData));   
        }
        
       function buildDetailedReport(dataSet){
	   
       }
        
        function calculateTotalAmount(dataSet){
           var totalAmount=0;
           angular.forEach(dataSet,function(expense){
               totalAmount+=expense.totalAmount;
           });
           return totalAmount;
           console.log('total amount for report '+totalAmount);
        }
        
        function getFormattedPeriod(periodInfo){
           var formattedPeriod='No Period';
            if(periodInfo.indexOf('_')>=0){
              var splitMonthYear=periodInfo.split('_'); 
              formattedPeriod=commonService.getMonthName(splitMonthYear[0])+', '+splitMonthYear[1];
           }else{
               formattedPeriod=periodInfo;  
           } 
            return formattedPeriod;
        }
        
        self.generateReport = _generateReport;            
        function _generateReport() {
            /*{ text:self.reportData.totalAmount ,
                style: 'subheader',
                margin: [ 0, 12, 0, 0] // margin: [left, top, right, bottom]
            },*/
             // plz see the pdfMake.org site for examples of document definitions
            console.log('In generate Report start');
		self.reportDetails= { content: [      // margin: [left, top, right, bottom
		getFormattedRow(self.reportData.mainHeader,[ 70, 12, 0, 0],'subheader'),
                getSimpleLine([ 0, 4, 0, 12]),
                { table: {
                        headers: 1,
                        widths: [ 175,100, 200],
                        body:self.reportData.reportContent 
                    }, 
                        pageBreak: self.reportData.pageBreak
                 } 
                ] };
		console.log('In generate Report end '+JSON.stringify(self.reportDetails));
                return self.reportDetails;
		};
		
         function getFormattedRow(textContent,margins,styles){
          return { text:textContent,
              style:styles,
              margin:margins
             };   
         }
         
         function getSimpleLine(margins){
           return  {canvas: [{type: 'line',
                 x1: 0, y1: 0,
                 x2: 500, y2:0
                 }],
              margin:margins
             };   
         }
    }