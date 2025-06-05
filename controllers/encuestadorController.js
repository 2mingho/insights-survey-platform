const Encuestador = require('../models/Encuestador');

exports.obtenerEncuestadorPorCarnet = async (req, res) => {
  try {
    const encuestador = await Encuestador.findOne({ carnet_asignado: req.params.carnet });
    if (!encuestador) {
      return res.status(404).json({ message: 'Encuestador no encontrado' });
    }
    res.json(encuestador);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.crearEncuestador = async (req, res) => {
  try {
    const {
      nombre_completo,
      cedula,
      carnet_asignado,
      funcion,
      id_proyecto,
      es_confidencial,
      entidad_responsable,
      zona_designada,
      foto_url,
      estado
    } = req.body;

    // Validaciones mínimas
    if (!nombre_completo || !cedula || !carnet_asignado || !id_proyecto || !zona_designada || !foto_url) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Crear nuevo encuestador
    const nuevo = new Encuestador({
      nombre_completo,
      cedula,
      carnet_asignado,
      funcion,
      id_proyecto,
      es_confidencial: Boolean(es_confidencial),
      entidad_responsable,
      zona_designada,
      foto_url,
      estado: estado || 'inactivo',
      creado_en: new Date(),
      actualizado_en: new Date()
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar encuestador' });
  }
};