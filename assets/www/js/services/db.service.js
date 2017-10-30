var serviceModule=angular.module('starter.services', []).service(
	'dbService',
	function() {
	    var self = this;
	    var recordCounter=0,isRecordsInserted=[],isMultiRecords,dataSet=[];
	    self.storeInfo = function(key, data) {
		if (angular.isDefined(data) && data.length) {
		    data = JSON.stringify(data);
		    localStorage.setItem(key, data);
		} else {
		    removeKey(key);
		}
	    };
	    self.getInfo = function(key) {
		var data = JSON.parse(localStorage.getItem(key));
		return data;
	    };
	    var removeKey = function(key) {
		localStorage.removeItem(key);
	    }
           self.createDatabase=function(){
              var request = window.indexedDB.open('expenseDB', 4.1);
               request.onupgradeneeded = function(event) {
        	   var db = event.target.result;
        	  var objectStore= manageObjectStore(db,'',false);
        	  objectStore.transaction.oncomplete=function(){
        	      plugins.showToast('Database created!'); 
        	  };
		};  
               
           };
           
	    self.openIndexDB = function(data,options,callback) {
		self.indexedDB = window.indexedDB || window.mozIndexedDB
			|| window.webkitIndexedDB || window.msIndexedDB;
		var request = window.indexedDB.open('expenseDB', 4.1);
		request.onsuccess =function(event){
		    processTransaction(event,data,options,true,callback);
		    };
	    };
	    
	    function processTransaction(event,data,options,dbExist,callback){
		var db = event.target.result;
		isMultiRecords=false;
		recordCounter=0;
		isRecordsInserted=[];
		dataSet=[];
		console.log('options '+JSON.stringify(options));
		var action=options.action,transaction,objectStore;
		if(action==='readwrite'){
		  transaction=db.transaction(["expenses"],action);
		  objectStore = transaction.objectStore("expenses");
		  if(angular.isArray(data)&& data.length>0){
		    isMultiRecords=true;
		    dataSet=data;
		    console.log('data is an array '+data);
		    checkRecordExist(data[recordCounter],objectStore,callback);
		  }else{
		      console.log('data is an single object '+data);
		   checkRecordExist(data,objectStore,callback);   
		  }
		}else{
		      transaction=db.transaction(["expenses"]);
			objectStore = transaction.objectStore("expenses");
		      fetchInfo(data,objectStore,options.searchBy,callback);    
		  }
	    }
	    
	    function checkRecordExist(data,objectStore,callback){
		console.log('data record '+JSON.stringify(data));
		var request = objectStore.get(data.date);
		
		request.onsuccess = function(event) {
		    var requestUpdate = data.totalAmount?objectStore.put(data):objectStore.delete(data.date);
		    requestUpdate.onerror = function(event) {
			recordsStatusHandler(callback,false,objectStore);
		    };
		    requestUpdate.onsuccess = function(event) {
			recordsStatusHandler(callback,true,objectStore); 
		    };
		};
		request.onerror = function(event) {
		    var addRequest=objectStore.add(data);
		    addRequest.onsuccess=function(){
			recordsStatusHandler(callback,true,objectStore);  
		      };
		      addRequest.onerror=function(){
		       recordsStatusHandler(callback,false,objectStore);  
		      }; 
		};
	    }
	    
	    function recordsStatusHandler(callback,recordStatus,objectStore){
		if(isMultiRecords){
		     if(!recordStatus){
	             isRecordsInserted.push(recordCounter);
		     }
		     recordCounter++;
		     if(recordCounter<dataSet.length){
		      checkRecordExist(dataSet[recordCounter],objectStore,callback);
		     }else{
			 var finalStatus=(isRecordsInserted.length===0);
			 callback(finalStatus,isRecordsInserted); 
		     }
		     
		  }else{
		    callback(recordStatus);  
		  }
	    }
	    
	    function fetchInfo(data,objectStore,searchBy,callback){
		if(searchBy==='key'){
		    var request = objectStore.get(data);
		    request.onerror = function(event) {
			callback(false,'');
		    };
		    request.onsuccess = function(event) {
		      // Do something with the request.result!
		      console.log(request.result?"Fetched data is " + JSON.stringify(request.result):'');
		      callback(true,request.result);
		    };  
		}else{
		    var indexKey=data.indexOf('_')>=0?'month_year':'year';
		    console.log('indexKey '+indexKey);
		    var index = objectStore.index(indexKey);
		    var resultSet=[],cursor;
		    console.log('in index flow '+data+'*************');
		    var singleKeyRange = IDBKeyRange.only(data);
		    index.openCursor(singleKeyRange).onsuccess = successHandler;
		}
		
		function successHandler(event) {
		     cursor = event.target.result;
		     if (cursor) {
		    resultSet.push(cursor.value);
		    cursor.continue();
		  }else{
		      callback(true,resultSet); 
		  }
		};
	    }

	    function manageObjectStore(db,action,dbExist) {
		var objectStore;
		if(dbExist){
		objectStore = db.transaction(["expenses"]).objectStore("expenses");
		}
		else{
		  objectStore = db.createObjectStore("expenses", {
		    keyPath : "date"
		});
		
		objectStore.createIndex("month_year", "month_year", {
		    unique : false
		});
		objectStore.createIndex("year", "year", {
		    unique : false
		});
		console.log('======New Index created');
		}
		return objectStore;
	    }
	});