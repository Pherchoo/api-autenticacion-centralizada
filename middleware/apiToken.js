const verifyToken = (req, res, next) => {
  const token = req.headers['x-api-token'];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({ message: 'Token invalido' });
  }

  next();
};

module.exports = { verifyToken };
