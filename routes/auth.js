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
const { verifyToken } = require('../middleware/apiToken');

// Todas las rutas requieren API token
router.use(verifyToken);

// CREATE - Registrar usuario
router.post('/register', register);

// READ - Login
router.post('/login', login);

// READ - Obtener todos los usuarios (protegido con JWT)
router.get('/usuarios', protect, getAllUsuarios);

// READ - Obtener usuario por ID (protegido con JWT)
router.get('/usuarios/:id', protect, getUsuarioById);

// UPDATE - Actualizar usuario (protegido con JWT)
router.put('/usuarios/:id', protect, updateUsuario);

// DELETE - Eliminar usuario (protegido con JWT)
router.delete('/usuarios/:id', protect, deleteUsuario);

module.exports = router;
