controllersModule.controller('expensesSettingsCtrl',function($scope,$state,dbService,
				$cordovaFile,ReportSvc,$ionicLoading,ReportBuilderSvc,commonService){
    var yearList=[];
    var backupDirectory='ExpenseBackup';
    var createYearList=function(year){
	  if(year<=2099){  
	  yearList.push(year+1);
	  createYearList(year+1);
	  }else{
	    $scope.yearRange=yearList;  
	  }  
    };
    $scope.setDisable=function(){
     $scope.disableSecureAccess=true;
     $scope.secureAccess.verifyPin='';
    };
    $scope.enableSecurePin=function(){
	dbService.genericStorage('securePinStatus',{status:'enabled'});
	commonService.showAlertModal({title:'Success!',
		message:'Secure pin Access enabled!'});
	    $scope.showDisableCta=true;
	
    };
    $scope.verifyDisableSecurePin=function(){
	var getCurrentPin=isCurrentPinExist();
	console.log('current one '+JSON.stringify(getCurrentPin)+' inpt is '+$scope.secureAccess.verifyPin);
	if(getCurrentPin && $scope.secureAccess.verifyPin && getCurrentPin.newPin===$scope.secureAccess.verifyPin){
	    dbService.genericStorage('securePinStatus',{status:'disabled'});
	    $scope.showDisableCta=false;
	    $scope.disableSecureAccess=false;
	    commonService.showAlertModal({title:'Success!',
		message:'Secure pin Access disabled!'});
	}else{
	    commonService.showAlertModal({title:'Verificaion failed!',
		message:'Please enter correct pin!'});  
	}
    };
    function isCurrentPinExist(){
     return dbService.getInfo('securePin');
    }
    $scope.changeSecurePin=function(){
	$scope.showSecurePinForm=$scope.currentPinInput=true;
	for(var key in $scope.secureAccess){
	    $scope.secureAccess[key]='';  
	}
    };
    $scope.verifyCurrentPin=function(){
	var getCurrentPin=isCurrentPinExist();
	console.log('current one '+JSON.stringify(getCurrentPin)+' inpt is '+$scope.secureAccess.currentPin);
	if(getCurrentPin && $scope.secureAccess.currentPin){
	  $scope.invalidCurrentPin= getCurrentPin.newPin!==$scope.secureAccess.currentPin;
	  if($scope.invalidCurrentPin){
	   $scope.secureAccess.currentPin='';   
	  }else{
	    $scope.currentPinVerified=true;  
	  }
	}
    };
    $scope.saveSecurePin=function(){
      if($scope.secureAccessForm.$valid){
	console.log('pin '+$scope.secureAccess.newPin+' confrm '+$scope.secureAccess.confirmPin);
	dbService.genericStorage('securePin',$scope.secureAccess);
	console.log('store info '+JSON.stringify(dbService.getInfo('securePin')));
	commonService.showAlertModal({title:'Success!',
			message:'Information saved!'});
	$scope.showSecurePinForm=$scope.currentPinInput=false;
	dbService.genericStorage('securePinStatus',{status:'enabled'});
      }else{
	  commonService.showAlertModal({title:'Invalid input provided!',
	      				message:'Secure pin must be four digits'});
	  $scope.secureAccess.newPin=$scope.secureAccess.confirmPin='';
	  $scope.confirmMisMatch=false;
      }
    };
    $scope.goHome=function(){
	       console.log('go to home');
	       $state.go('expenses-home');
     };
     $scope.proceed=function(stateName){
	 $state.go(stateName); 
     };
     $scope.toggleExportBy=function(exportBy){
	 $scope.exportByYear=(exportBy==='Year');	 
     };
     $scope.updateMonthYear=function(selectedInput){
	 if($scope.exportByYear){
	     $scope.selectedYear=selectedInput;
	 }else{
	     $scope.selectedMonth=selectedInput;  
	 }
	  
     };
     $scope.exportReport=function(){
	 console.log('export by '+$scope.exportByYear);
	 var filterOption=$scope.exportByYear?$scope.selectedYear:formatMonth($scope.selectedMonth);
	 console.log('selected export by '+filterOption);
	 fetchDetails(filterOption);
     };
     $scope.chooseFileToImport=function(){
	 /*var files=cordova.file.externalDataDirectory+'expense-backup7_2017.txt';
	     console.log('file name '+files);
	     $cordovaFile.readAsText(files).then(function(result) {
		    console.log('readAsText: '+result);
		    alert('readAsText: '+result);
		    storeImportedData(result);
	     },function(error){
		 alert('getting error '+JSON.stringify(error));
	     });*/
	 fileChooser.open(function(selectedFileURI){
	     console.log('selected file '+selectedFileURI);
	    // var files=cordova.file.externalDataDirectory+'/expense-backup07_2017.json';
	     console.log('file info '+selectedFileURI);
	    if(selectedFileURI.endsWith('.txt')){
	     $cordovaFile.readAsText(selectedFileURI).then( function(result) {
			console.log('readAsText: '+result);
			 storeImportedData(result);
	     },function(error){
		 alert('getting error '+JSON.stringify(error));
	     });
	    }else{
	     alert('Invalid file format! Please choose (.txt) backup file');	
	    }
	 },function(){
	     alert('Error in file selection');
	 });
     };
     function storeImportedData(data){
	 data=JSON.parse(data);
	 dbService.openIndexDB(data,{action:'readwrite',searchBy:''},function(status,errorSet){
		   if(status){
		     plugins.showToast('All Expenses saved successfully!');    
		   }else{
		     alert('Error: Some of the records contains invalid data!');
		     alert('Records numbers : '+errorSet);
		   }
	       });	 
     }
     function formatMonth(date){
	return ((date.getMonth()+1)+'_'+date.getFullYear());
      }
     var fetchDetails=function(exportBy){
	       dbService.openIndexDB(exportBy,{action:'read',searchBy:'index'},function(status,dataSet){
	 	 if(status){
	 	    console.log('actual '+JSON.stringify(dataSet));
	 	    $scope.noRecordsFound=dataSet.length<1;
	 	    console.log('backFile check '+$scope.fileOptions.backupFile+' pdf file check '+$scope.fileOptions.pdfFile);
	 	   if(!$scope.noRecordsFound){
	 	    if($scope.fileOptions.backupFile){
	 	      backupFileOperation(dataSet,exportBy);
	 	    }
	 	   if($scope.fileOptions.pdfFile){
    		      pdfFileOperation(dataSet);
	 	    }
	 	   } 
	 	      $scope.$apply();
	 	 }else{
	 	    plugins.showToast('Error in data fetch operation!');
	 	 }
	       });
	   };
	   
	   function pdfFileOperation(dataSet){
	    ReportBuilderSvc.buildReport(dataSet);
	    $scope.runReport();
	   }
	   
	   function backupFileOperation(dataSet,exportBy){
	     //cordova.file.externalDataDirectory
	 	    var fileTargetUrl=cordova.file.externalRootDirectory+'/'+backupDirectory;
	 	    var fileName="expense-backup"+exportBy+".txt";
	 	    if(!$scope.noRecordsFound){
	 		createBackupFile(fileTargetUrl,fileName,dataSet);
	 	    }else{
	 		alert('No Expenses found for your choice!');
	 	    }  
	   }
	   
	   function createBackupFile(fileTargetUrl,fileName,dataSet){
	       $cordovaFile.writeFile(fileTargetUrl, fileName, JSON.stringify(dataSet), true)
	 	      .then(function (success) {
	 		  alert('Expense Details Exported Successfully! Please check "ExpenseBackup" Folder in your Device or SD Card Storage!');
	 		  
	 	      }, function (error) {
	 		 alert('error in data export '+JSON.stringify(error));
	 	      });   
	   }
	   
	   function createBackupDirectory(){
	       $cordovaFile.checkDir(cordova.file.externalRootDirectory, 'ExpenseBackup')
		      .then(function (success) {
		       //if directory exist nothing to do	 
		      }, function (error) {
			 console.log('Directory does not exist '+JSON.stringify(error));
			$cordovaFile.createDir(cordova.file.externalRootDirectory, backupDirectory, false)
			      .then(function (success) {
				 console.log('Backup directory created');
			      }, function (error) {
			        alert('Unable to create Backup Directory '+JSON.stringify(error));
			      });
		      });   
	   }
     
    function init(){
     console.log('Settings controller');
     $scope.choice='ex';
     $scope.exportByYear=false;
     $scope.selectedMonth='Select Month';
     $scope.yearRange=[];
     $scope.exportBy='Month';
     $scope.fileOptions={backupFile:false,pdfFile:false};
     $scope.backupFile=$scope.pdfFile=false;
     $scope.secureAccess={};
     $scope.showSecurePinForm=isCurrentPinExist()?false:true;
     $scope.showDisableCta=true;
     createYearList(2014);
     createBackupDirectory();
    }
    init();
    
     /////////////////////PDF Creation code/////////////////////////////////////
    $scope.runReport = _runReport;
    $scope.clearReport = _clearReport;
    _activate();
    
    function _activate() {        
//
// ReportSvc Event Listeners: Progress/Done
//    used to listen for async progress updates so loading text can change in 
//    UI to be repsonsive because the report process can be 'lengthy' on 
//    older devices (chk reportSvc for emitting events)
//
		$scope.$on('ReportSvc::Progress', function(event, msg) {
			_showLoading(msg);
		});		 
		$scope.$on('ReportSvc::Done', function(event, err) {
			_hideLoading();
		});        
    }
    
    function _runReport() {
        //if no cordova, then running in browser and need to use dataURL and iframe
        if (!window.cordova) {
            ReportSvc.runReportDataURL( {},{} )
                .then(function(dataURL) {
                    //set the iframe source to the dataURL created
                    console.log('report run in browser using dataURL and iframe');
                    document.getElementById('pdfImage').src = dataURL;
                });
            return true;
        }
        //if codrova, then running in device/emulator and able to save file and open w/ InAppBrowser
        else {
            ReportSvc.runReportAsync( {},{} )
                .then(function(filePath) {
                    //log the file location for debugging and oopen with inappbrowser
                    console.log('report run on device using File plugin');
                    console.log('ReportCtrl: Opening PDF File (' + filePath + ')');
                   // window.open(filePath, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
                    _hideLoading();
                });
            return true;
        }
	}

    //reset the iframe to show the empty html page from app start
    function _clearReport() {
        document.getElementById('pdfImage').src = "empty.html";
    }
//
// Loading UI Functions: utility functions to show/hide loading UI
//
    function _showLoading(msg) {
        $ionicLoading.show({
          template: msg
        });
    }
    function _hideLoading(){
        $ionicLoading.hide();
    }
    /////////////////////End of PDF Creation code/////////////////////////////
});
