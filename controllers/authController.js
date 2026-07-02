const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Registrar usuario
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombreUsuario, contraseña } = req.body;

    if (!nombreUsuario || !contraseña) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const usuarioExiste = await Usuario.findOne({ nombreUsuario });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const usuario = await Usuario.create({
      nombreUsuario,
      contraseña: hashedPassword
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: { id: usuario._id, nombreUsuario: usuario.nombreUsuario }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { nombreUsuario, contraseña } = req.body;

    const usuario = await Usuario.findOne({ nombreUsuario });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
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

module.exports = { register, login };