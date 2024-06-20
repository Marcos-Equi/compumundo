document.getElementById('search-button').addEventListener('click', function() {
    var query = document.getElementById('search-input').value;
    window.location.href = `/producto/${query}`;
});