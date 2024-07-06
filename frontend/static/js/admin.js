document.addEventListener('DOMContentLoaded', function() {
    const miCuentaBtn = document.getElementById('mi-cuenta');
    const misComprasBtn = document.getElementById('mis-compras');
    const salirBtn = document.getElementById('salir');
    
    const miCuentaContent = document.getElementById('mi-cuenta-content');
    const misComprasContent = document.getElementById('mis-compras-content');

    miCuentaBtn.addEventListener('click', function() {
        miCuentaContent.style.display = 'block';
        misComprasContent.style.display = 'none';
    });

    misComprasBtn.addEventListener('click', function() {
        misComprasContent.style.display = 'block';
        miCuentaContent.style.display = 'none';
    });

    salirBtn.addEventListener('click', function() {
        window.location.href = '/';
    });
});