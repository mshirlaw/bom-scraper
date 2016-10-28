(function(){
	'use strict';
	
	var request = require('request');
	var cheerio = require('cheerio');
	var Q = require('q');
	
	function BomScraper() {
		
		this.fetchCurrentObsFor = fetchCurrentObsFor;
		
		function fetchCurrentObsFor(state) {
			
			var defer = Q.defer();
			if (!state || !state.match(/^(nsw|vic|qld|wa|tas|act|nt|sa)$/)) {
				defer.reject({error:'Invalid state abbreviation'});
			} else {
				var url = 'http://www.bom.gov.au/' + state + '/observations/' + state + 'all.shtml';
				fetchCurrentObs(url)
			}
			return defer.promise;
			
			function fetchCurrentObs(url) {
				
				request(url, function(error, response, body){	
					 if(!error){ 
					 	var $ = cheerio.load(body);
						var json = {};
						
						var tableHeaders = $('th');
						var tableHash = {};
						tableHeaders.each(function(i, el){
							var tableHeaderID = $(this).attr('id');
							if (tableHeaderID.indexOf('-station-') != -1) {
								var tableID = tableHeaderID.substr(0,tableHeaderID.indexOf('-'));
								if (!tableHash[tableID]){
									tableHash[tableID] = [];
								} else {
									tableHash[tableID].push({
										tableHeaderID: tableHeaderID,
										datetimeAttr: tableID + '-datetime' + ' ' + tableHeaderID,
										temperatureAttr: tableID + '-tmp' + ' ' + tableHeaderID,
										windDirectionAttr: tableID + '-wind' + ' ' + tableID + '-wind-dir' + ' ' + tableHeaderID,
										windSpeedAttr: tableID + '-wind' + ' ' + tableID + '-wind-spd-kmh' + ' ' + tableHeaderID,
										location: $('a', $(this)).text(),
									});
								}
							}
						});
						
						var tableData = $('td');
						tableData.each(function(i, el){
							var headers = $(this).attr('headers');
							var tableID = headers.substr(0,headers.indexOf('-'));
							var tableHeaderID = tableID + headers.substr(headers.indexOf('-station'), headers.length);
							if (headers.indexOf('-datetime') != -1) {
								var datetime = tableHash[tableID].find(function(element){
									return element.tableHeaderID === tableHeaderID;
								});
								if (datetime) {
									datetime.datetime= $(this).text();
								}
							} else if (headers.indexOf('-tmp') != -1) {
								var found = tableHash[tableID].find(function(element){
									return element.tableHeaderID === tableHeaderID;
								});
								if (found) {
									found.temperature = $(this).text();
								}
							} else if (headers.indexOf('-wind-dir') != -1) {
								var found = tableHash[tableID].find(function(element){
									return element.tableHeaderID === tableHeaderID;
								});
								if (found) {
									found.windDirection = $(this).text();
								}
							} else if (headers.indexOf('-wind-spd-kmh') != -1) {
								var found = tableHash[tableID].find(function(element){
									return element.tableHeaderID === tableHeaderID;
								});
								if (found) {
									found.windSpeed = $(this).text();
								}
							} 
						});
						defer.resolve(tableHash);
					} else {
						defer.reject({error:'Error with request'});
					}
				});
			}
		}
	}
	
	module.exports = BomScraper;
	
})();