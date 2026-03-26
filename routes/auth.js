const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Genera un token JWT
 *     description: Endpoint público para obtener un token de acceso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *             properties:
 *               id:
 *                 type: string
 *                 description: Identificador del usuario
 *                 example: user01
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Daniel
 *     responses:
 *       '200':
 *         description: Token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '400':
 *         description: Datos incompletos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: id y nombre son requeridos
 */
router.post('/token', (req, res) => {
  const { id, nombre } = req.body

  if (!id || !nombre) {
    return res.status(400).json({ state: false, msg: 'id y nombre son requeridos' })
  }

  const token = jwt.sign(
    {
      sub: id,
      nombre,
      exp: Date.now() + 60 * 60 * 1000 // 1 hora
    },
    process.env.SECRET
  )

  res.json({ state: true, token })
})

module.exports = router
