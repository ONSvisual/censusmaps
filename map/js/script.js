
//Check whether inline svg is supported

if(Modernizr.inlinesvg==true) {

pymChild = new pym.Child();


function initialise() {


	dvc = {};

	numberFormatP = d3.format(",.1%");
	numberFormat = d3.format(",d");
	lsoa = null;
	laCode = null;

	//Statistics
	housePrice = null;
	Income_Est = null;

	//ASSUMPTIONS
	lendAmount = 4.5; //subject to change
	depositAmount = 15; //subject to change
	balanceAmount = 100-depositAmount; //subject to change
	Stamp_Duty = null;
	conveyancingFees = 1200; //subject to change
	surveyCosts = 0; //subject to change
	removalCosts = 0; //subject to change
	otherFees = 800; //subject to change

	E_W_Average = (140000/100)*balanceAmount;
	E_W_Average_Income_Required = E_W_Average / lendAmount;

	allFees = conveyancingFees + surveyCosts + removalCosts + otherFees;
	totalSavings = null;

	fromPrice = 0;
	fromPriceText = "";

	checkTheSame = null;
	buttonCode="A_All";



	//╭━━╮╱╱╱╱╱╱╱╱╭╮
	//╰┫┣╯╱╱╱╱╱╱╱╭╯╰╮
	//╱┃┃╭━╮╭━━┳╮┣╮╭╋━━╮
	//╱┃┃┃╭╮┫╭╮┃┃┃┃┃┃━━┫
	//╭┫┣┫┃┃┃╰╯┃╰╯┃╰╋━━┃
	//╰━━┻╯╰┫╭━┻━━┻━┻━━╯
	//╱╱╱╱╱╱┃┃
	//╱╱╱╱╱╱╰╯

	$("#pcError").hide();
	$("#successMessage").hide();
	$("#pcGo").click(function( event ) {
		//console.log("helloyou");
			//	event.preventDefault();
			//	event.stopPropagation();
				myValue = $("#pcText").val();
				myValue = myValue.toUpperCase();

					//manual method for area lookup
					myValue2 = myValue.replace(/\s+/g, '');

					getCodes1(myValue2);

					//console.log("helloyou");
	});




	$("#pcText").keypress(function( event ) {
		if (event.which == 13) {
				event.preventDefault();
				event.stopPropagation();
				myValue = $("#pcText").val();
				myValue = myValue.toUpperCase();

					//manual method for area lookup
					myValue2 = myValue.replace(/\s+/g, '');

					getCodes1(myValue2);
		}
	});

	LSOA = null;
	LSOA_name = null;
	LAname = null;

	//╭━━━╮╱╱╭╮╱╭━━━╮
	//┃╭━╮┃╱╭╯╰╮┃╭━╮┃
	//┃┃╱╰╋━┻╮╭╯┃┃╱┃┣━┳━━┳━━╮
	//┃┃╭━┫┃━┫┃╱┃╰━╯┃╭┫┃━┫╭╮┃
	//┃╰┻━┃┃━┫╰╮┃╭━╮┃┃┃┃━┫╭╮┃
	//╰━━━┻━━┻━╯╰╯╱╰┻╯╰━━┻╯╰╯

	//your location
	d3.select(".useLocation").on("click",function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			//x.innerHTML = "Geolocation is not supported by this browser.";
		}
	});

	//start watch events on buttons
	d3.selectAll(".radio-primary-fullwidth").on("click", function(){
				getButtons();
				
					});
	
	
	d3.selectAll(".radio-secondary-fullwidth").on("click", function(){
				getButtons();
				
					});
	
	
	d3.selectAll(".dropdown").on("change", function(){
				getButtons();
				
					});
	}
	


	function getButtons(){
		
		if($(window).width() >= 650) {
		
			buttonCode=$('input[name=genderbutton]:checked').val()+$('input[name=agebutton_d]:checked').val();
		
		} else {
			buttonCode=$('input[name=genderbutton]:checked').val()+$(".dropdown option:selected").val();;
			
		}
//		
//        d3.selectAll(".radio-secondary-fullwidth").attr("aria-checked","false");
//		
//		d3.selectAll(".radio-secondary-fullwidth").property("checked","false");
//		
//		ageselected = $('input[name=agebutton]:checked').val();
//		
//		d3.selectAll("b" + ageselected).attr("aria-checked","false");
//		
//		d3.selectAll("b" + ageselected).property("checked","false");

		refreshMap(dvc.districtsInView);
		drawStats();
		
	}//end of getButtons


	function showPosition(position) {
		latitudeValue = position.coords.latitude;
		longitudeValue = position.coords.longitude;

		getCodes2(latitudeValue,longitudeValue);
	}


function getCodes1(myValue2)    {

    var myURIstring=encodeURI("https://api.postcodes.io/postcodes/"+myValue2);
    $.support.cors = true;
    $.ajax({
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        url: myURIstring,
        error: function (xhr, ajaxOptions, thrownError) {
                $("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();
            },
        success: function(data1){
            if(data1.status == 200 ){


                $("#pcError").hide();
                LSOA =data1.result.lsoa.replace(/\s/g,'');

				laCode =data1.result.codes.admin_district;

                // LAname = data1.result.admin_district;

				//fire the function returning statistics
				drawStats();

				gotoArea(data1.result.latitude,data1.result.longitude);


            } else {
      $("#successMessage").hide();
                $("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();
            }
        }
    });
}


function getCodes2(lat,lng)    {


    var myURIstring=encodeURI("https://api.postcodes.io/postcodes?lon="+lng+"&lat="+lat);
    $.support.cors = true;
    $.ajax({
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        url: myURIstring,
        error: function (xhr, ajaxOptions, thrownError) {
                $("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();
            },
        success: function(data1){
            if(data1.status == 200 ){


                $("#pcError").hide();
                LSOA =data1.result[0].lsoa.replace(/\s/g,'');

               // LAname = data1.result[0].admin_district;

				//fire the function returning statistics
				drawStats();

				gotoArea(data1.result[0].latitude,data1.result[0].longitude);


            } else {
      $("#successMessage").hide();
                $("#pcError").text("Sorry, that's not a valid postcode. Try an English or Welsh postcode eg PO15 5RR.").show();
            }
        }
    });
}




	function areaName() {
		d3.select("#placeNameDisplay").style("display","block");
		d3.select("#placeNameName").text(LSOA_name);
	}

//
//
////╭━━━╮╱╱╱╱╱╱╱╱╱╱╭━━━╮╭╮╱╱╱╭╮
////╰╮╭╮┃╱╱╱╱╱╱╱╱╱╱┃╭━╮┣╯╰╮╱╭╯╰╮
////╱┃┃┃┣━┳━━┳╮╭╮╭╮┃╰━━╋╮╭╋━┻╮╭╋━━╮
////╱┃┃┃┃╭┫╭╮┃╰╯╰╯┃╰━━╮┃┃┃┃╭╮┃┃┃━━┫
////╭╯╰╯┃┃┃╭╮┣╮╭╮╭╯┃╰━╯┃┃╰┫╭╮┃╰╋━━┃
////╰━━━┻╯╰╯╰╯╰╯╰╯╱╰━━━╯╰━┻╯╰┻━┻━━╯
//
function drawStats() {
//		//reading in the data
//
		queue()
		.defer(d3.csv,"data/Cut2/" + LSOA + ".csv")//SPD data
		.defer(d3.csv,"data/Cut3/" + LSOA + ".csv")//SAPE
		.defer(d3.csv,"data/Cut4/" + LSOA + ".csv")//Percentage
		.await(readingData);

		function readingData(error,data1,data2,data3){

			//strip the comma out of the data
			data1[0][buttonCode]=parseFloat(data1[0][buttonCode].replace(/,/g, ''));
			data2[0][buttonCode]=parseFloat(data2[0][buttonCode].replace(/,/g, ''));

			//Put the data in the html
			d3.select("#spd").text(numberFormat(+data1[0][buttonCode]))

			d3.select("#sape").text(numberFormat(+data2[0][buttonCode]))

			d3.select("#percentage").text(Math.round(data3[0][buttonCode]*10)/10 + "%")
			// get the name of LSOA including spaces
			LSOA_name=data3[0]["LSOA11NM"]

			//fire the function dealing with area name displayed
				areaName();

	};//end of readingData
}//end of drawStates

if (pymChild) {
   pymChild.sendHeight();
}


		 //╭━╮╭━╮
//┃┃╰╯┃┃
//┃╭╮╭╮┣━━┳━━┳━━┳┳━╮╭━━╮
//┃┃┃┃┃┃╭╮┃╭╮┃╭╮┣┫╭╮┫╭╮┃
//┃┃┃┃┃┃╭╮┃╰╯┃╰╯┃┃┃┃┃╰╯┃
//╰╯╰╯╰┻╯╰┫╭━┫╭━┻┻╯╰┻━╮┃
//╱╱╱╱╱╱╱╱┃┃╱┃┃╱╱╱╱╱╭━╯┃
//╱╱╱╱╱╱╱╱╰╯╱╰╯╱╱╱╱╱╰━━╯

    // Copyright (c) 2013 Ryan Clark
    // https://gist.github.com/rclark/5779673
	function ready (error, topoLSOA, topoLAD, boundsData, config){

					//if($(window).width() >= 650){


						  L.TopoJSON = L.GeoJSON.extend({
						  addData: function(jsonData) {
							if (jsonData.type === "Topology") {
							  for (key in jsonData.objects) {
								geojson = topojson.feature(jsonData, jsonData.objects[key]);
								L.GeoJSON.prototype.addData.call(this, geojson);
							  }
							}
							else {
							  L.GeoJSON.prototype.addData.call(this, jsonData);
							}
						  }
						});

						dvc.config = config

						d3.select("#graphic").remove();
						//dvc = {};
						dataLayer = [];
						dataObj = [];



						if(dvc.config.ons.varcolour instanceof Array) {
							dvc.colour = dvc.config.ons.varcolour
						} else {
							dvc.colour = eval("colorbrewer." + dvc.config.ons.varcolour);
						}

						highlighted = 0;
						dvc.curr = dvc.config.ons.varload;
						a = 0;
						dvc.unittext = dvc.config.ons.varunit[a];
						dvc.label = dvc.config.ons.varlabel[a];
						dvc.prefix = dvc.config.ons.varprefix[a];



						//data2 = data;
						config2 = dvc.config;

						if(dvc.config.ons.varlabel.length > 1)
							{navigation(config2);}
						else {d3.selectAll("#varsel").attr("class","hidden")};




						if(dvc.config.ons.breaks =="jenks")
							{breaks = ss.jenks(values, 5);}
						else {breaks = dvc.config.ons.breaks[a];};

						layerx = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',{
						  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB background</a>'
						});

						map = L.map('map',{maxZoom:16,minZoom:12}),


						//Set-up colour scale
						color = d3.scale.threshold()
								.domain(breaks.slice(1,5))
								.range(dvc.colour);

						//Set initial centre view and zoom layer
						map.setView(eval(dvc.config.ons.centre), dvc.config.ons.zoom).addLayer(layerx);



						map.on("zoomstart", leaveLayer)
						map.on("zoomend", function(){setTimeout(function(){highlightArea()},500)})



						d3.select(".leaflet-top").style("top","70px");
						createKey(dvc.config);


						//Set-up new Topojson layer (for LAs)

						  topoLayerLA= new L.TopoJSON();

						  topoLayerLA.addData(topoLAD);
						  topoLayerLA.eachLayer(handleLayerLAD);
						  topoLayerLA.addTo(map);


						topoLayer = [];

						boundarySearch(boundsData.regions);

						//Get bounds of map

						// Handle map movement
						map.on('moveend', function(e) {

							boundarySearch(boundsData.regions);

						});

						//}end of if width is smaller than mobile

						//first firing on load

						setTimeout(function() {
					//	$( document ).ready(function( event ) {

								myValue = $("#pcText").val();
								myValue = myValue.toUpperCase();

								//manual method for area lookup
								myValue2 = myValue.replace(/\s+/g, '');
								getCodes1(myValue2);

								d3.select("#toolView").transition().duration(500).style("opacity","1");

							//	fireSocial();
								pymChild.sendHeight();
					//	});
						},0);
	} // end ready

	function handleLayerLAD(layer){

		x = layer.feature.properties.LAD13CD;

		//fillColor = color(rateById[x]);

        layer.setStyle({
		  fillColor: '#fff',
          fillOpacity: 0,
          color:'#fff',
          weight:0,
          opacity:1,
		  className: x
        });

    }


	function handleLayerLSOA(layer){

		x = layer.feature.properties.LSOA11CD + " LSOA";
		x2 = layer.feature.properties.LSOA11CD;
		x3 = layer.feature.properties.LSOA11NM.replace(/\s/g,'');

		//console.log(layer.feature.properties);

		fillColor = color(rateById[x2]);
		//console.log(fillColor);

        layer.setStyle({
		  fillColor: fillColor,
          fillOpacity: 0.7,
          color:'#fff',
          weight:0.7,
          opacity:1,
		  className: x + " " + x3
        });

    }


    function mouseEvents(){


	  var xy = d3.select(".leaflet-overlay-pane").selectAll(".LSOA");

	  xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",clicked);

    }

  	function clicked(d) {
	  if (d3.event.defaultPrevented) return;

	  selectArea(this);

	  //MSOA = d3.select(this).attr("class").split(' ')[2];

	  LSOA = d3.select(this).attr("class").split(' ')[2];
	  //LSOA_name= d3.select(this).attr("class").split(' ')[0];


	  drawStats();

	}

	function getLatLng(){

	}

	function selectArea(xx) {


				selected=true;
				myId = d3.select(xx).attr("class").split(' ')[0];
				currclass = d3.select(xx).attr("class").split(' ')[0];

				setTimeout(function(){highlightArea()},500)
				$("#occselect").val(currclass);
				$("#occselect").trigger("chosen:updated");

				d3.select(".leaflet-overlay-pane").selectAll(".LSOA").on("mouseout",null).on("mouseover",null);

				//indexarea = document.getElementById("occselect").selectedIndex;
				//pymChild.sendMessage('navigate', indexarea + " " + dvc.time);
	}





	function enterLayer(){
		currclass = d3.select(this).attr("class").split(' ')[0];
		highlightArea();

	}

    function highlightArea(){

		//console.log(currclass);

		d3.select('#selected').remove();

		//console.log(currclass);
		var currpath = d3.select("." + currclass).attr("d");

		d3.select(".leaflet-overlay-pane").select("svg").append("path")
				.attr("d",currpath)
				.attr("id","selected")
				.attr("class", "arcSelection")
				.attr("pointer-events", "none")
				.attr("fill", "none")
				.attr("stroke", "#b4005a")
				.attr("stroke-width", "2");


		/* Display name of area*/
		d3.select("#areanm").text(areaById[currclass]);
		d3.select("#areainfo").html(function(d,i){if (!isNaN(rateById[currclass]))  {return "<span>" + dvc.unittext + "</span>" + dvc.prefix + rateById[currclass] } else {return "Data unavailable"}});


    }

    function leaveLayer(){

		d3.select('#selected').remove();
		d3.select("#areanm").text("");
		d3.select("#areainfo").text("");
    }




	function boundarySearch(regions) {
	oldDistricts = dvc.districtsInView;
	districtsInView = [];
	updateBoundaryData();



	function updateBoundaryData(mapBounds) {
		mapBounds = map.getBounds();

		var districtsInView = [],
			regionCodes = Object.keys(regions),
			regionBounds,
			districts,
			districtCodes,
			districtBounds,
			bounds;


		for (var i = 0; i < regionCodes.length; i++) {

			regionBounds = regions[regionCodes[i]].bounds;

			//console.log(mapBounds);

			if (mapBounds.intersects(regionBounds)) {

				districts = regions[regionCodes[i]].districts;
				districtCodes = Object.keys(districts);

				for (var j = 0; j < districtCodes.length; j++) {

					districtCode = districtCodes[j];
					districtBounds = districts[districtCode].bounds;

					if (mapBounds.intersects(districtBounds)) {
						
						
						//Hack to trap if it's trying to load a scottish boundary
						if(districtCode.substr(0,1) != "S") {
							
							districtsInView.push(districtCode);
						}
					}
				}
			}
		}

		districtsInView = districtsInView;
		dvc.districtsInView = districtsInView;


		addRemoveAreas(oldDistricts,districtsInView);
	};
};//end of boundarySearch

function refreshMap(newDistricts){
	newDistricts.forEach(function(d,i) {
		 map.removeLayer(topoLayer[d]);
		 removeData(d);
		});

	newDistricts.forEach(function(d,i) {
		d3.json('https://cdn.ons.gov.uk/assets/topojson/lsoa_by_lad/topo_' + d + '.json', function(error, distData) {

			d3.csv('data/Cut/' + d + '.csv', function(error, csvData) {

			  buildDataInView(d,csvData);
			  topoLayer[d] = new L.TopoJSON();
			  topoLayer[d].on('click', function(e) {
				  gotoArea(e.latlng.lat,e.latlng.lng);
			   });

			  topoLayer[d].addData(distData);
			  topoLayer[d].eachLayer(handleLayerLSOA);
			  topoLayer[d].addTo(map);

			  mouseEvents();

			  if(highlighted == d) {
				  areaHigh = leafletPip.pointInLayer([storeLong,storeLat], topoLayer[d]);
				  currclass = areaHigh[0].options.className.split(' ')[0];
				highlightArea();
			  }

			 if(i == newDistricts.length-1 && highlighted !=0) {
				d3.select(".leaflet-overlay-pane").selectAll(".LSOA").on("mouseout",null).on("mouseover",null);
			 }


			});

		});

	});


}

function addRemoveAreas(oldDistricts, newDistricts) {

	areasToAdd = $(newDistricts).not(oldDistricts).get();

	var areasToRemove = $(oldDistricts).not(newDistricts).get();


	areasToRemove.forEach(function(d,i) {
		 map.removeLayer(topoLayer[d]);

		 removeData(d);

	});

	leng = areasToAdd.length;

	areasToAdd.forEach(function(d,i) {

		//var jsonPath = 'lsoa_by_lad/topo_' + d + '.json';
		//console.log(jsonPath);

		d3.json('https://cdn.ons.gov.uk/assets/topojson/lsoa_by_lad/topo_' + d + '.json', function(error, distData) {

			//console.log('https://cdn.ons.gov.uk/assets/topojson/msoa_by_lad/topo_' + d + '.json');

			d3.csv('data/Cut/' + d + '.csv', function(error, csvData) {

			  buildDataInView(d,csvData);

			  topoLayer[d] = new L.TopoJSON();

			  topoLayer[d].on('click', function(e) {
				  gotoArea(e.latlng.lat,e.latlng.lng);

			   });


			  topoLayer[d].addData(distData);
			  topoLayer[d].eachLayer(handleLayerLSOA);
			  topoLayer[d].addTo(map);



			  mouseEvents();




			  if(highlighted == d) {
				  areaHigh = leafletPip.pointInLayer([storeLong,storeLat], topoLayer[d]);

				  currclass = areaHigh[0].options.className.split(' ')[0];
				  //console.log(areaHigh[0].options.className.split(' ')[0]);

				highlightArea();

			  }



			 if(i == leng-1 && highlighted !=0) {
				d3.select(".leaflet-overlay-pane").selectAll(".LSOA").on("mouseout",null).on("mouseover",null);
			 }

			});

		});

	});

}//end addRemoveAreas


	function buildDataInView(d,csvData) {

			dataObj[d] = csvData;


			dataLayer.push(dataObj[d]) ;

			flattenedData = [].concat.apply([],dataLayer);

			rateById = {};
			areaById = {};

			//console.log(flattenedData);

			flattenedData.forEach(function(d) {rateById[d.LSOA11CD] = +eval("d."+buttonCode); areaById[d.LSOA11CD] = d.LSOA11NM});


	}

	function removeData(d,csvData) {

		  	delete dataLayer[d];

			//console.log(d);

			flattenedData = [].concat.apply([],dataLayer);

	}




	function createKey(config){

		//var mapTitle = d3.select("#mapTitleText")
//			.append("svg")
//				.attr("id","mapDescription")
//				.attr("width","295px")
//				.attr("height","40px")
//				.attr("z-index","6")
//				.style("padding-left","10px")
//				.attr("fill","#007F7F")
//					.append("text")
//					.text("Entry level property price* (£)")
//					.attr("text-anchor","start")
//					.attr("font-size","20px")
//					.attr("transform","translate(0,30)");


		var svgkey = d3.select("#keydiv")
			.append("svg")
			.attr("id", "key")
		    .attr("height", 300);

		newbreaks = breaks;

		var color = d3.scale.threshold()
		   .domain(newbreaks)
		   .range(dvc.colour);

		//console.log(color.domain());

		y = d3.scale.linear()
		    .domain([newbreaks[0], breaks[5]]) /*range for data*/
		    .range([250, 0]); /*range for pixels*/

		keywidth = $("#keydiv").width();

		x = d3.scale.linear()
		    .domain([newbreaks[0], breaks[5]]) /*range for data*/
		    .range([0,keywidth-50]); /*range for pixels*/

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
    		.tickSize(15)
		    .tickValues(color.domain())
			.tickFormat(d3.format(",.1f"));


		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
    		.tickSize(15)
		    .tickValues(color.domain())
			.tickFormat(d3.format(",.1f"));

		var g = svgkey.append("g").attr("id","vert").attr("class","hidden-xs")
			.attr("transform", "translate(70,20)");


		g.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				y0: i ? y(color.domain()[i]) : y.range()[0],
				y1: i < color.domain().length ? y(color.domain()[i+1]) : y.range()[1],
				z: d
			  };
			}))
			.enter().append("rect")
			.attr("width", 8)
			.attr("y", function(d) {return d.y1; })
			.attr("height", function(d) {return d.y0 - d.y1; })
			.style("opacity",0.8)
			.style("fill", function(d) {return d.z; });

		g.call(yAxis).append("text");

		g.append("line")
			.attr("x1","8")
			.attr("x2","55")
			.attr("y1",function(){return y(config.ons.average)})
			.attr("y2",function(){return y(config.ons.average)})
			.attr("stroke","blue")
			.attr("stoke-width",1);

		g.append("text")
			.attr("x","10")
			.attr("y",function(){return y(config.ons.average) - 4})
			.attr("class","average")
			.text(dvc.config.ons.averagelabel);

		g.append("text")
			.attr("x","10")
			.attr("y",function(){return y(config.ons.average) + 11})
			.attr("class","average")
			.text(numberFormat(dvc.config.ons.average));

		//add units

		g.append("text").attr("id","keyunit").text(dvc.unittext).attr("transform","translate(0,-5)");


		//horizontal key

		var g2 = svgkey.append("g").attr("id","horiz").attr("class","visible-xs")
			.attr("transform", "translate(25,5)");

		keyhor = d3.select("#horiz");

		g2.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				x0: i ? x(color.domain()[i]) : x.range()[0],
				x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
				z: d
			  };
			}))
		  .enter().append("rect")
			.attr("height", 8)
			.attr("x", function(d) { return d.x0; })
			.attr("width", function(d) { return d.x1 - d.x0; })
			.style("opacity",0.8)
			.style("fill", function(d) { return d.z; });


		keyhor.selectAll("rect")
			.data(color.range().map(function(d, i) {
			  return {
				x0: i ? x(color.domain()[i]) : x.range()[0],
				x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
				z: d
			  };
			}))
			.attr("x", function(d) { return d.x0; })
			.attr("width", function(d) { return d.x1 - d.x0; })
			.style("fill", function(d) { return d.z; });

		keyhor.call(xAxis).append("text")
			.attr("id", "caption")
			.attr("x", -63)
			.attr("y", -20)
			.text("");

		keyhor.append("rect")
			.attr("id","keybar")
			.attr("width",8)
			.attr("height",0)
			.attr("transform","translate(15,0)")
			.style("fill", "#ccc")
			.attr("x",x(0));



		d3.select("#horiz").selectAll("text").attr("transform",function(d,i){if(i % 2){return "translate(0,10)"}});
		// put the unit on the horizontal axis
		g2.append("text")
		.attr("id","keyunit2")
		.attr("x",x.range()[1])
		.attr("y","15")
		.text(dvc.unittext)
		.attr("transform","translate(2,-1)");

		//put the average on the legend too

		d3.select("#horiz").append("line")
			.attr("class","averageline")
			.attr("x1",function(){return x(config.ons.average)})
			.attr("x2",function(){return x(config.ons.average)})
			.attr("y1","0")
			.attr("y2","50")
			.attr("stroke","blue")
			.attr("stoke-width",1);

		d3.select("#horiz").append("text")
			.attr("x",function(){return x(config.ons.average)- 30})
			.attr("y","50")
			.attr("class","average")
			.text(dvc.config.ons.averagelabel);

		g2.append("text")
			.attr("x",function(){return x(config.ons.average)+ 4})
			.attr("y","50")
			.attr("class","average")
			.text(numberFormat(dvc.config.ons.average));
		}// end of createKey

		function navigation(data){

			$("#navigation").show();

		//Build pills

			dvc.varname = data.ons.varname;
			dvc.varunit = data.ons.varunit;

			a = dvc.varname.indexOf(dvc.curr);
			dvc.unittext = dvc.varunit[a];
			dvc.label = data.ons.varlabel[a];
			dvc.prefix = data.ons.varprefix[a];

			var pills = d3.select("#pills")
					.append("ul")
					.attr("class","nav navbar nav-pills navbar-inverse nav-justified")


			pills.selectAll("li")
				.data(data.ons.varlabel)
				.enter()
				.append("li")
				.attr("id", function(d,i){return data.ons.varname[i]})
				.append("a")
				.attr("href","#")
				.attr("data-nm", function(d,i){return data.ons.varname[i]})
				.attr("data-toggle","pill")
				.text(function(d,i){return d;})
				.on("click", function(d,i){
					dvc.curr = d3.select(this).attr("data-nm");
					a = dvc.varname.indexOf(dvc.curr);
					updateMap(dvc.config2);
					//updateHash(dvc.curr);
					dvc.unittext = dvc.varunit[a];
					dvc.label = data.ons.varlabel[a];
					d3.select("#keyunit").text(dvc.unittext);
				});


			d3.select("#" + dvc.curr).attr("class","active");

			 var highest = null;

			   $(".nav-pills a").each(function(){  //find the height of your highest link
				   var h = $(this).height();
				   if(h > highest){
					  highest = $(this).height();
				   }
				});

			   $(".nav-pills a").height(highest);  //set all your links to that height.

			d3.select("#varsel").html(dvc.label + " <span class='caret'></span>");

			dropnext = d3.select("#menu").append("ul")
					.attr("class","dropdown-menu")
					.attr("role","menu");

			dropnext.selectAll("li")
					.data(data.ons.varlabel)
					.enter()
					.append("li")
					.attr("id", function(d,i){return "drop" + data.ons.varname[i]})
					.append("a")
					.attr("href","#")
					.attr("data-nm", function(d,i){return data.ons.varname[i]})
					.text(function(d,i){return d;})
					.on("click", function(d,i){
						dvc.curr = d3.select(this).attr("data-nm");
						a = dvc.varname.indexOf(dvc.curr);
						updateMap(dvc.config2);
						dvc.unittext = dvc.varunit[a];
						d3.select("#varsel").html(data.ons.varlabel[i] + " <span class='caret'></span>");
						dvc.label = data.ons.varlabel[a];
						d3.select("#keyunit").text(dvc.unittext);
						dropnext.selectAll("li").attr("class","")
						d3.select("#drop" + dvc.curr).attr("class","active");
					});

			d3.select("#drop" + dvc.curr).attr("class","active");

	}

	function gotoArea(lat,lng) {

			map.setView([lat,lng])

			storeLong = lng;
			storeLat = lat;

			var results = leafletPip.pointInLayer([storeLong,storeLat], topoLayerLA);

			if(results.length > 0) {
					highlighted = results[0].options.className;
			}

	}


	if($(window).width() >= 650){
  // do your stuff

	function updateMap(config){
		
		
		//var values =  data.map(function(d) { return +eval("d." + dvc.curr); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);

		// Generate some breaks based on the Jenks algorithm - http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization
		if(config.ons.breaks =="jenks")
			{breaks = ss.jenks(values, 5);}
		else {breaks = config.ons.breaks[a];};

		// Set up a colour scaling variable
		// This time using the jenks breaks we've defined
		color = d3.scale.threshold()
			.domain(breaks.slice(1,5))
			.range(dvc.colour);


		d3.select("#keydiv").select("svg").remove();

		//createKey(dvc.config);


		// Create an object to give yourself a pair of values for the parlicon code and data value

		rateById = {};
		flattenedData.forEach(function(d) { rateById[d.LSOA11CD] = +eval("d." + dvc.curr); });

		dvc.districtsInView.forEach(function(d,i) {
			topoLayer[d].eachLayer(handleLayerLSOA);
		});

		var xy = d3.select(".leaflet-overlay-pane").selectAll(".LSOA");

		xy.on("mouseout",leaveLayer).on("mouseover",enterLayer).on("click",click);

	}

	}



  //  }; // End function ready


	initialise();
	//Load data and config file


	//if($(window).width() >= 650){
    queue()
		.defer(d3.json, "data/topo_E06000008.json")
		.defer(d3.json, "data/topo_lad.json")
		.defer(d3.json, "data/bounds.json")
		.defer(d3.json, "data/config.json")
		.await(ready);
	//}

	} else {
		d3.select(".container").html("Sorry your browser does not support this interactive graphic");
		d3.select(".container")
			.append("img")
			.attr("src","./images/altaffordability.png")
			.attr("width","100%")
			.attr("height","100%");


	}
