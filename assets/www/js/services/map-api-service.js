angular
	.module('starter.services', [])
	.service(
		'mapService',
		function($window) {
		    var selfObj = this;
		    selfObj.initializeService = function() {
			selfObj.modal = {
			    funcName : '',
			    apiFlag : '',
			    userLocation : [],
			    currentCenter : [],
			    points : [],
			    map : '',
			    directionsDisplay:'',
			    directionsService:'',
			    destinationPoint:[],
			}
		    };
		    selfObj.initializeSearchInput=function(){
			var input =document.getElementById('pac-input');
			selfObj.modal.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
			var autocomplete = new google.maps.places.Autocomplete(input);
			  autocomplete.bindTo('bounds', selfObj.modal.map);

			  var infowindow = new google.maps.InfoWindow();
			  var marker = new google.maps.Marker({
			    map: selfObj.modal.map,
			    anchorPoint: new google.maps.Point(0, -29)
			  });

			  google.maps.event.addListener(autocomplete, 'place_changed', function() {
			    infowindow.close();
			    marker.setVisible(false);
			    var place = autocomplete.getPlace();
			    if (!place.geometry) {
			      console.log("Autocomplete's returned place contains no geometry");
			      return;
			    }

			    // If the place has a geometry, then present it on a map.
			    if (place.geometry.viewport) {
				selfObj.modal.map.fitBounds(place.geometry.viewport);
			    } else {
				selfObj.modal.map.setCenter(place.geometry.location);
				selfObj.modal.map.setZoom(17);  // Why 17? Because it looks good.
			    }
			    marker.setIcon({
			      url: place.icon,
			      size: new google.maps.Size(71, 71),
			      origin: new google.maps.Point(0, 0),
			      anchor: new google.maps.Point(17, 34),
			      scaledSize: new google.maps.Size(35, 35)
			    });
			    marker.setPosition(place.geometry.location);
			    marker.setVisible(true);
			    var address = '';
			    if (place.address_components) {
			      address = [
			        (place.address_components[0] && place.address_components[0].short_name || ''),
			        (place.address_components[1] && place.address_components[1].short_name || ''),
			        (place.address_components[2] && place.address_components[2].short_name || '')
			      ].join(' ');
			    }

			    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			    infowindow.open(selfObj.modal.map, marker);
			  });
		    };
		    $window.response = function() {
			console.log('api loaded done res');
			if (arguments.length === 2 && arguments[0] === 'error') {
			    console.log('No Network Access');
			    plugins.showToast('No Network Access');
			    selfObj.modal.apiFlag = false;
			    if (selfObj.modal.funcName !== 'none')
				selfObj.modal.funcName();
			} else {
			    console.log('api loaded successfully 1');
			    selfObj.modal.apiFlag = true;
			    if (selfObj.modal.funcName !== 'none')
				selfObj.modal.funcName();
			}
		    }
		    selfObj.loadAPIStatus = function() {
			if (arguments.length === 2 && arguments[0] === 'error') {
			    console.log('No Network Access');
			    plugins.showToast('No Network Access');
			    selfObj.modal.apiFlag = false;
			    if (selfObj.modal.funcName !== 'none')
				selfObj.modal.funcName();
			} else {
			    console.log('api loaded successfully 2');
			    selfObj.modal.apiFlag = true;
			    if (selfObj.modal.funcName !== 'none')
				selfObj.modal.funcName();
			}
		    };
		    selfObj.loadScript = function(callbackFunc) {
			console.log('load script calledss');
			selfObj.modal.funcName = 'none';
			selfObj.modal.apiFlag = false;
			selfObj.modal.funcName = callbackFunc;
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&noCache='
				+ Math.random().toString().slice(3)
				+ '&libraries=geometry,places,drawing&ext=.js&'
				+ 'callback=response';
			script.onerror = function() {
			    selfObj.modal.apiFlag = false;
			    selfObj.loadAPIStatus('error',
				    selfObj.modal.funcName);
			};
			document.body.appendChild(script);
		    };

		    selfObj.loadMap = function() {
			console.log('load map from service called');
			if(selfObj.modal.map){
			    selfObj.loadedMapCallback();   
			}else{
			    selfObj.loadScript(selfObj.loadedMapCallback);// load google map   
			}
		    };
		    selfObj.loadedMapCallback = function() {
			if (selfObj.modal.apiFlag) {
			    selfObj.checkUserLocation();
			} else
			    plugins.showToast('Map feature is not availabel! Please reload');

		    };
		    selfObj.checkUserLocation = function() {
			/*selfObj.modal.userLocation = [ 37.334818, -121.884886 ];
			selfObj.modal.currentCenter = [ 37.334818, -121.884886];
			selfObj.setMapToUserLocation();
			return;*/
			var userLat;
			var userLong;
			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(function(
				    position) {
				userLat = position.coords.latitude;
				userLong = position.coords.longitude;
				console.log("current lat " + userLat + " lang "
					+ userLong);
				selfObj.modal.userLocation = [ userLat,
					userLong ];
				selfObj.modal.currentCenter = [ userLat,
					userLong ];
				selfObj.setMapToUserLocation();

			    }, selfObj.showError, {
				enableHighAccuracy : true,
				maximumAge : 0,
				frequency : 5000,
				timeout : 20000
			    });
			} else
			    plugins.showToast("Location Tracking  is not supported");

		    };
		    selfObj.showError = function(error) {
			switch (error.code) {
			case error.PERMISSION_DENIED:
			    plugins.showToast("User denied the request for Geolocation.");
			    break;
			case error.POSITION_UNAVAILABLE:
			    plugins.showToast("Location information is unavailable.");
			    break;
			case error.TIMEOUT:
			    plugins.showToast("The request to get user location timed out.\n\ Make sure you have enabled your location access services");
			    break;
			case error.UNKNOWN_ERROR:
			    plugins.showToast("An unknown error occurred.");
			    break;
			}
		    };
		    selfObj.setMapToUserLocation = function() {
			var centerPoint=new google.maps.LatLng(selfObj.modal.currentCenter[0],selfObj.modal.currentCenter[1])
			selfObj.modal.map = new google.maps.Map(
				document.getElementById('mapContainer'),
				{
				    zoom : 7,
				    center : centerPoint,
				    mapTypeId : google.maps.MapTypeId.ROADMAP,
				    mapTypeControl : false,
				    panControl : false,
				    zoomControl : true,

				});
			google.maps.event.addListener(selfObj.modal.map,
				'idle', function() {
				    // alert("map loaded");
				});
			var marker = new google.maps.Marker({
			    position : new google.maps.LatLng(
				    selfObj.modal.userLocation[0],
				    selfObj.modal.userLocation[1]),
			    map : selfObj.modal.map,
			    icon : 'img/current_location.png' // image

			});
			google.maps.event
				.addListener(
					marker,
					'click',
					(function(marker) {
					    return function() {
						var infowindow = new google.maps.InfoWindow(
							{
							    content : "<label style='font-size: 12px; color: #f40000;'> You are here!</label>"
							});
						infowindow.open(
							selfObj.modal.map,
							marker);

					    };
					})(marker));
			
			//selfObj.initializeDirectionService(centerPoint);
			selfObj.initializeSearchInput();
		    };
		    selfObj.initializeDirectionService=function(centerPoint){
			selfObj.modal.directionsService=new google.maps.DirectionsService();
			selfObj.modal.directionsDisplay = new google.maps.DirectionsRenderer();
		        selfObj.modal.directionsDisplay.setMap(selfObj.modal.map);
		        selfObj.calculateRoute(centerPoint);
		    };
		    selfObj.calculateRoute=function(centerPoint){
			var end = new google.maps.LatLng(37.441883, -122.143019);
			/*var endMarker = new google.maps.Marker({
		            position: end,
		            map: selfObj.modal.map,
		            draggable: true
		        });*/
			        var request = {
			            origin:centerPoint,
			            destination: end,
			            travelMode: google.maps.TravelMode.DRIVING
			        };
			        selfObj.modal.directionsService.route(request, function (response, status) {
			            if (status == google.maps.DirectionsStatus.OK) {
			        	selfObj.modal.directionsDisplay.setDirections(response);
			        	//selfObj.modal.directionsDisplay.setMap(selfObj.modal.map);
			            } else {
			                console.log("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
			            }
			        });
		    };
		    selfObj.initializeService();

		});