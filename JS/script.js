function buscarBebida(){
    const entrada = document.getElementById("busqueda").value.trim().toLowerCase();
  
    const rutas = {
      "moca helado": "mocahelado.html",
      "americano": "americano.html",
      "expreso": "expreso.html",
      "capuchino": "capuchino.html",
      "frapuccino": "frapuccino.html",
      "afogato": "afogato.html"
    };
  
    if (rutas[entrada]) {
      window.location.href = rutas[entrada];
    } else {
      alert("Bebida no encontrada");
    }

    return false;
}