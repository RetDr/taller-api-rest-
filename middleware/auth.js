const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ state: false, msg: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.SECRET)

    if (Date.now() > payload.exp) {
      return res.status(401).json({ state: false, msg: 'Token expirado' })
    }

    req.usuario = payload
    next()
  } catch (err) {
    return res.status(401).json({ state: false, msg: 'Token inválido' })
  }
}

module.exports = verificarToken
