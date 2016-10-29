var request = require('request');
var expect = require('chai').expect;
var sinon = require('sinon');
var BomScraper = require('./bom-scraper');

describe('fetchCurrentObsFor(state) with successful request', function(){
	
	before(function(done){
		var page = buildPageHtml();
		sinon.stub(request, 'get').yields(null, null, page);
		done();
	});
	
	after(function(){
		request.get.restore();
	});
	
	it('should return an error object when state is invalid', function(){
		var scraper = new BomScraper();
		return scraper.fetchCurrentObsFor('NOT_A_VALID_STATE').then(function(response){
			expect(response).not.to.be.defined;
		}).catch(function(error){
			expect(error).to.be.defined;
			expect(error).to.be.an('Object');
			expect(error).to.have.property('error');
			expect(error.error).to.equal('Invalid state abbreviation');
		});
	});
	
	it('should return an object of the correct structure when state is valid', function(){
		var scraper = new BomScraper();
		return scraper.fetchCurrentObsFor('nsw').then(function(response){
			expect(response).to.have.property('tNR');
			expect(response.tNR).to.be.an('Array');
			expect(response.tNR).to.have.lengthOf(1);
		});
	});
	
	it('should correctly scrape HTML to generate JSON', function(){
		var scraper = new BomScraper();
		return scraper.fetchCurrentObsFor('nsw').then(function(response){
			var actual = response.tNR[0];
			expect(actual).to.have.property('location');
			expect(actual.location).to.equal('Ballina');
			expect(actual).to.have.property('datetime');
			expect(actual.datetime).to.equal('29/03:00am');
			expect(actual).to.have.property('temperature');
			expect(actual.temperature).to.equal('17.6');
			expect(actual).to.have.property('windDirection');
			expect(actual.windDirection).to.equal('NNE');
			expect(actual).to.have.property('windSpeed');
			expect(actual.windSpeed).to.equal('11');
		});
	});
	
});

describe('fetchCurrentObsFor(state) with error in request', function(){
	
	before(function(done){
		var error = { error: 'request.get failed' };
		sinon.stub(request, 'get').yields(error, null, null);
		done();
	});
	
	after(function(){
		request.get.restore();
	});
	
	it('should correctly reject the promise when there is an error in the request', function(){
		var scraper = new BomScraper();
		return scraper.fetchCurrentObsFor('nsw').then(function(response){
			expect(response).not.to.be.defined;
		}).catch(function(error){
			expect(error).to.be.defined;
			expect(error).to.be.an('Object');
			expect(error).to.have.property('error');
			expect(error.error).to.equal('Error with request');
		});
	});
});

function buildPageHtml() {
	var html =
	'<div>' +
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
	return html;
}