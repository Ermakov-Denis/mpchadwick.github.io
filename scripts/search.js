var data = JSON.parse(document.getElementById('search-data').textContent);

var idx = lunr(function() {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('tags', {boost: 20});
});

for (var key in data) {
    idx.add(data[key])
}

function runSearch(query) {
    var results = idx.search(query);
    var html = '';
    if (results.length > 0) {
        html += '<ul>';
        for (var i = 0; i < results.length; i++) {
            var result = data[results[i].ref];
            html += '<li><a href="' + result.url + '">' + htmlDecode(result.title) + '</a></li>';
        }
        html += '</ul>';
    } else {
        html += 'No Results';
    }
    document.querySelectorAll('.search-results__container')[0].innerHTML = html;
}

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

document.querySelectorAll('.search-form__button')[0].addEventListener('click', function(e) {
    e.preventDefault();
    var query = document.querySelectorAll('.search-form__input')[0].value
    var location = '/search?query=' + query;
    if (window.ga && ga.create) {
        ga('set', 'page', location);
        ga('send', 'pageview');
    }
    history.pushState(null, null, location);
    runSearch(query);
    return false;
})

var queryString = window.location.search.substring(1);
var params = queryString.split('&');
for (var i = 0; i < params.length; i++) {
    var parts = params[i].split('=');
    if (parts[0] === 'query') {
        var query = decodeURIComponent(parts[1].replace(/\+/g, '%20'));
        document.querySelectorAll('.search-form__input')[0].value = query
        runSearch(query);
    }
}