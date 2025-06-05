document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const carnetInput = document.getElementById('carnet');
  const carnet = carnetInput.value.trim();

  if (!carnet) {
    alert('Por favor ingrese un ID de encuestador');
    return;
  }

  try {
    const res = await fetch(`/api/encuestadores/${carnet}`);
    const data = await res.json(); // Se parsea una sola vez

    if (!res.ok) {
      alert(data.message || 'Encuestador no encontrado');
      carnetInput.value = ''; // Limpia el campo tras intento fallido
      return;
    }

    // Guardamos en localStorage para que encuestador.html acceda a los datos
    localStorage.setItem('encuestadorData', JSON.stringify(data));
    window.location.href = '/encuestador.html';
  } catch (error) {
    console.error(error);
    alert('Hubo un error al buscar el encuestador.');
  }
});