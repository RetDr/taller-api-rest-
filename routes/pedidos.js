const express = require('express')
const router = express.Router()
const Pedido = require('../models/Pedido')
const verificarToken = require('../middleware/auth')

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     description: Retorna la lista de pedidos con información del cliente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *                       cliente:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                             example: Carlos Gómez
 *                           email:
 *                             type: string
 *                             example: carlos@email.com
 *                       estado:
 *                         type: string
 *                         example: pendiente
 *                       total:
 *                         type: number
 *                         example: 150000
 *       '401':
 *         description: No autorizado
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
 *                   example: Token no proporcionado
 *       '501':
 *         description: Error del servidor
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Oh!! Algo ha pasado
 */
router.get('/', verificarToken, async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('cliente', 'nombre email telefono')
    res.json({ state: true, data: pedidos })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     description: Busca un pedido específico con los detalles del cliente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *     responses:
 *       '200':
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a1b2c3d4e5f6a7b8c9d0e2
 *                     cliente:
 *                       type: object
 *                     productos:
 *                       type: array
 *                     estado:
 *                       type: string
 *                       example: pendiente
 *                     total:
 *                       type: number
 *                       example: 150000
 *       '401':
 *         description: Pedido no encontrado
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
 *                   example: Pedido no encontrado
 */
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('cliente', 'nombre email telefono')
    if (!pedido) return res.status(401).json({ state: false, msg: 'Pedido no encontrado' })
    res.json({ state: true, data: pedido })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     description: Registra un pedido asociado a un cliente con sus productos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente
 *               - productos
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: ID del cliente
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: Laptop Dell
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *                     precioUnitario:
 *                       type: number
 *                       example: 2500000
 *               estado:
 *                 type: string
 *                 example: pendiente
 *               observaciones:
 *                 type: string
 *                 example: Entregar en la mañana
 *     responses:
 *       '201':
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a1b2c3d4e5f6a7b8c9d0e2
 *                     total:
 *                       type: number
 *                       example: 5000000
 *       '501':
 *         description: Error del servidor
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Oh!! Algo ha pasado
 */
router.post('/', verificarToken, async (req, res) => {
  try {
    const pedido = new Pedido(req.body)
    const saved = await pedido.save()
    res.status(201).json({ state: true, data: saved })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     description: Modifica el estado u observaciones de un pedido existente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: enviado
 *               observaciones:
 *                 type: string
 *                 example: Actualizado - entregado en portería
 *     responses:
 *       '200':
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       '401':
 *         description: Pedido no encontrado
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
 *                   example: Pedido no encontrado
 */
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!pedido) return res.status(401).json({ state: false, msg: 'Pedido no encontrado' })
    res.json({ state: true, data: pedido })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido
 *     description: Elimina un pedido de la base de datos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *     responses:
 *       '200':
 *         description: Pedido eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Pedido eliminado correctamente
 *       '401':
 *         description: Pedido no encontrado
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
 *                   example: Pedido no encontrado
 */
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id)
    if (!pedido) return res.status(401).json({ state: false, msg: 'Pedido no encontrado' })
    res.json({ state: true, msg: 'Pedido eliminado correctamente' })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

module.exports = router
