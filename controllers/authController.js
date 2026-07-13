const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// CREATE - Registrar usuario
const register = async (req, res) => {
  try {
    const { nombreUsuario, contrasena } = req.body;

    if (!nombreUsuario || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres' });
    }

    const usuarioExiste = await Usuario.findOne({ nombreUsuario });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const usuario = await Usuario.create({
      nombreUsuario,
      contrasena: hashedPassword
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: { id: usuario._id, nombreUsuario: usuario.nombreUsuario }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// READ - Login usuario
const login = async (req, res) => {
  try {
    const { nombreUsuario, contrasena } = req.body;

    if (!nombreUsuario || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const usuario = await Usuario.findOne({ nombreUsuario });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: { id: usuario._id, nombreUsuario: usuario.nombreUsuario }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// READ - Obtener todos los usuarios (protegido)
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contrasena').sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Usuarios obtenidos correctamente',
      total: usuarios.length,
      usuarios: usuarios.map(u => ({
        id: u._id,
        nombreUsuario: u.nombreUsuario,
        fechaCreacion: u.createdAt,
        fechaActualizacion: u.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// READ - Obtener usuario por ID (protegido)
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-contrasena');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario obtenido correctamente',
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        fechaCreacion: usuario.createdAt,
        fechaActualizacion: usuario.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// UPDATE - Actualizar usuario (protegido)
const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { nombreUsuario, contrasena } = req.body;

    if (nombreUsuario) {
      const usuarioExistente = await Usuario.findOne({ nombreUsuario });
      if (usuarioExistente && usuarioExistente._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'El nombre de usuario ya esta en uso' });
      }
      usuario.nombreUsuario = nombreUsuario;
    }

    if (contrasena) {
      if (contrasena.length < 6) {
        return res.status(400).json({ message: 'La contrasena debe tener al menos 6 caracteres' });
      }
      const salt = await bcrypt.genSalt(10);
      usuario.contrasena = await bcrypt.hash(contrasena, salt);
    }

    await usuario.save();

    res.status(200).json({
      message: 'Usuario actualizado correctamente',
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        fechaCreacion: usuario.createdAt,
        fechaActualizacion: usuario.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// DELETE - Eliminar usuario (protegido)
const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await Usuario.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Usuario eliminado correctamente',
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
};
