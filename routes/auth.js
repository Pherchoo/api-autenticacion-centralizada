const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// CREATE - Registrar usuario (publico)
router.post('/register', register);

// READ - Login (publico)
router.post('/login', login);

// READ - Obtener todos los usuarios (protegido)
router.get('/usuarios', protect, getAllUsuarios);

// READ - Obtener usuario por ID (protegido)
router.get('/usuarios/:id', protect, getUsuarioById);

// UPDATE - Actualizar usuario (protegido)
router.put('/usuarios/:id', protect, updateUsuario);

// DELETE - Eliminar usuario (protegido)
router.delete('/usuarios/:id', protect, deleteUsuario);

module.exports = router;
