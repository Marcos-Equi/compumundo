document.getElementById('search-button').addEventListener('click', function (e) {
    e.preventDefault();
    let query = document.getElementById('search-input').value;
    if (!query)
        return;
    window.location.href = `/producto?nombre=${query}`;
});