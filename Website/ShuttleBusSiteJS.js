	var overlay;
	COD.prototype = new google.maps.OverlayView();

        // Initialize the map and the custom overlay
        function initMap() 
	 {
		 // Coordinates for Bus Stops
	        var stop1 = {lat: 41.841454, lng: -88.073906};   
		var stop2 = {lat: 41.839027, lng: -88.077883};
	    
                var map = new google.maps.Map(document.getElementById('map'), 
		{
          		zoom: 16,
		        // Map centered at these coordiantes
                       center: {lat: 41.841190, lng: -88.072572},
        	});

		 var bounds = new google.maps.LatLngBounds(
            	 new google.maps.LatLng(41.837260, -88.082800), // southwest boundary
            	 new google.maps.LatLng(41.844745, -88.063041)); // northeast boundary

		 // Image to be overlayed
       		 var srcImage = "COD2.jpg";
		 var directionsDisplay = new google.maps.DirectionsRenderer({
          	 map: map,
	         preserveViewport: true  });

        	// Set destination, origin and travel mode.
       	        var request = 
		{	
         	 	destination: stop2,
          		origin: stop1,
         		travelMode: 'DRIVING'
        	};

        	// Pass the directions request to the directions service.
        	var directionsService = new google.maps.DirectionsService();
        	directionsService.route(request, function(response, status) 
		{
			if (status == 'OK') 
			{
                		// Display the route on the map.
                		directionsDisplay.setDirections(response);
                	 }
        	});
      
        	// The custom COD object contains the src image,
       		// the bounds of the image, and a reference to the map.
      		overlay = new COD(bounds, srcImage, map);
		
	 }

        /** @constructor */
	function COD(bounds, image, map) 
	{
		// Initialize all properties.
		this.bounds_ = bounds;
        	this.image_ = image;
       	        this.map_ = map;

        	// Define a property to hold the image's div. We'll
        	// actually create this div in the onAdd()
        	// method so its's left null for now.
        	this.div_ = null;

        	// Explicitly call setMap on this overlay.
        	this.setMap(map);
	}

        /**
        * onAdd is called when the map's panes are ready and the overlay has been
        * added to the map.
        */
	COD.prototype.onAdd = function() 
	{
		var div = document.createElement('div');
		div.style.borderStyle = 'none';
		div.style.borderWidth = '0px';
		div.style.position = 'absolute';

		// Create the img element and attach it to the div.
		var img = document.createElement('img');
		img.src = this.image_;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.position = 'absolute';
		div.appendChild(img);

		this.div_ = div;

		// Add the element to the "overlayLayer" pane.
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);
        };

	COD.prototype.draw = function() 
	{
		// We use the south-west and north-east
		// coordinates of the overlay to peg it to the correct position and size.
		// To do this, we need to retrieve the projection from the overlay.
		var overlayProjection = this.getProjection();

		// Retrieve the south-west and north-east coordinates of this overlay
		// in LatLngs and convert them to pixel coordinates.
		// We'll use these coordinates to resize the div.
		var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
		var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

		// Resize the image's div to fit the indicated dimensions.
		var div = this.div_;
		div.style.left = sw.x + 'px';
		div.style.top = ne.y + 'px';
		div.style.width = (ne.x - sw.x) + 'px';
		div.style.height = (sw.y - ne.y) + 'px';
      };

	// The onRemove() method will be called automatically from the API if
        // we ever set the overlay's map property to 'null'.
        COD.prototype.onRemove = function() 
	{
		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
        };

	// Set the visibility to 'hidden' or 'visible'.
        COD.prototype.hide = function() 
	{
		if (this.div_) 
		{
			// The visibility property must be a string enclosed in quotes.
			this.div_.style.visibility = 'hidden';
		}
	};

	COD.prototype.show = function() 
	{
		if (this.div_) 
		{
			this.div_.style.visibility = 'visible';
		}
	};

	COD.prototype.toggle = function() 
	{
		if (this.div_) 
		{
			if (this.div_.style.visibility === 'hidden') 
			{
				this.show();
			}
			else 
				this.hide();
		}
	};

      google.maps.event.addDomListener(window, 'load', initMap);
	  
