import 'whatwg-fetch';

function get(url) {
	return fetch(url)
	.then(function(response) {
		return response;
	});
}

export function getJson(url) {
	return get(url).then(function(response){
		return response.json();
	})
}