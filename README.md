# bom-scraper
A simple web scraper to fetch real time weather observations in Australia

## Installation

	npm install bom-scraper --save

## Usage

	var BomScraper = require('bom-scraper');
	var bom = new BomScraper();
	
	var state = 'nsw'; // i.e. nsw|vic|qld|wa|tas|act|nt|sa
	bom.fetchCurrentObsFor(state).then(function(response){
		res.send(response);
	}).catch(function(error){
		res.send(error);
	});

## Return Object

The object returned by a call to `fetchCurrentObsFor(state)` consists of current weather observations for a given NSW state. The return object consists of an array of location observation data for each weather region in the given state i.e. for NSW this could look like:

	{  
		"tNR":[  
			{  
				"location":"Cape Byron",
				"datetime":"28/08:00pm",
				"temperature":"21.7", // i.e. degrees celsius
				"windDirection":"N",
				"windSpeed":"17" // i.e. km/hr
			},
			{  
				"location":"Casino",
				"datetime":"28/08:00pm",
				"temperature":"21.4",
				"windDirection":"ESE",
				"windSpeed":"11"
			},
			// etc
		],
		"tMNC":[  
			{  
				"location":"Dorrigo",
				"datetime":"28/09:00am",
				"temperature":"15.0",
				"windDirection":"CALM",
				"windSpeed":"0"
			},
			{  
				"location":"Forster",
				"datetime":"28/03:00pm",
				"temperature":"22.0",
				"windDirection":"ESE",
				"windSpeed":"17"
			},
			// etc
		],
		// etc
	}
	
Where `tNR` is the Northern Rivers Region and `tMNC` is the Mid North Coast Region. To see the data that is available (for NSW) see [Latest Weather Observations for New South Wales](http://www.bom.gov.au/nsw/observations/nswall.shtml). 

## Warning

Use at your own risk. This scraper is dependent upon the structure of the BOM site remaining consistent. I can not guarantee that changes to the BOM site won't break this code. I will endeavor to keep this up to date but no guarantee can be provided. Feel free to submit an issue / PR on GitHub to help out.

## Release History

* 1.0.0 Initial Release
* 1.0.1 Added setup code for unit tests
