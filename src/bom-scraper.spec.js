var request = require('request');
var expect = require('chai').expect;
var sinon = require('sinon');
var BomScraper = require('./bom-scraper');

describe('bom-scraper', function(){
	
	before(function(done){
		var page = buildPageHtml();
		sinon.stub(request, 'get').yields(null, null, page);
		done();
	});
	
	after(function(){
		request.get.restore();
	});
	
	// TODO test return data from fetchCurrentObsFor
	it('should correctly scrape table data', function(){
		var scraper = new BomScraper();
		expect(scraper.fetchCurrentObsFor('nsw')).to.be.defined;
	});
	
});

function buildPageHtml() {
	return '<div>' +
				'<table id="tNR">' +
					'<tr>' +
						'<th id="tNR-station-ballina"><a href="">Ballina</a></th>' +
						'<td headers="tNR-datetime tNR-station-ballina">29/03:00am</td>' +
						'<td headers="tNR-tmp tNR-station-ballina">17.6</td>' +
						'<td headers="tNR-wind tNR-wind-dir tNR-station-ballina">NNE</td>' +
						'<td headers="tNR-wind tNR-wind-spd-kmh tNR-station-ballina">11</td>' +
					'</tr>' +
				'</table>' +
			'</div>';
}