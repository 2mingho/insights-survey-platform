document.getElementById("buscarBtn").addEventListener("click", () => {
  const input = document.getElementById("carnetInput");
  const carnet = input.value.trim();
  if (!carnet) {
    alert("Por favor ingresa un ID de encuestador.");
    return;
  }
  window.location.href = `/encuestador/${encodeURIComponent(carnet)}`;
});