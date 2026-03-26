const express = require('express')
const router = express.Router()
const Cliente = require('../models/Cliente')
const verificarToken = require('../middleware/auth')

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Retorna la lista completa de clientes registrados
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de clientes
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
 *                         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *                       nombre:
 *                         type: string
 *                         example: Carlos Gómez
 *                       email:
 *                         type: string
 *                         example: carlos@email.com
 *                       telefono:
 *                         type: string
 *                         example: "3001234567"
 *                       direccion:
 *                         type: string
 *                         example: Calle 10 # 5-20
 *       '401':
 *         description: Token no válido o no proporcionado
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
 *               example: Error interno del servidor
 */
router.get('/', verificarToken, async (req, res) => {
  try {
    const clientes = await Cliente.find()
    res.json({ state: true, data: clientes })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     description: Busca y retorna un cliente específico por su ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente en MongoDB
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       '200':
 *         description: Cliente encontrado
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
 *                       example: 64a1b2c3d4e5f6a7b8c9d0e1
 *                     nombre:
 *                       type: string
 *                       example: Carlos Gómez
 *                     email:
 *                       type: string
 *                       example: carlos@email.com
 *                     telefono:
 *                       type: string
 *                       example: "3001234567"
 *                     direccion:
 *                       type: string
 *                       example: Calle 10 # 5-20
 *       '401':
 *         description: Cliente no encontrado
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
 *                   example: Cliente no encontrado
 */
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
    if (!cliente) return res.status(401).json({ state: false, msg: 'Cliente no encontrado' })
    res.json({ state: true, data: cliente })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Registra un nuevo cliente en la base de datos
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - telefono
 *               - direccion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Carlos Gómez
 *               email:
 *                 type: string
 *                 example: carlos@email.com
 *               telefono:
 *                 type: string
 *                 example: "3001234567"
 *               direccion:
 *                 type: string
 *                 example: Calle 10 # 5-20
 *     responses:
 *       '201':
 *         description: Cliente creado exitosamente
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
 *                       example: 64a1b2c3d4e5f6a7b8c9d0e1
 *                     nombre:
 *                       type: string
 *                       example: Carlos Gómez
 *                     email:
 *                       type: string
 *                       example: carlos@email.com
 *       '501':
 *         description: Error del servidor
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error interno del servidor
 */
router.post('/', verificarToken, async (req, res) => {
  try {
    const cliente = new Cliente(req.body)
    const saved = await cliente.save()
    res.status(201).json({ state: true, data: saved })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     description: Modifica los datos de un cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Carlos Gómez Actualizado
 *               telefono:
 *                 type: string
 *                 example: "3009876543"
 *               direccion:
 *                 type: string
 *                 example: Carrera 5 # 10-30
 *     responses:
 *       '200':
 *         description: Cliente actualizado
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
 *         description: Cliente no encontrado
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
 *                   example: Cliente no encontrado
 */
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!cliente) return res.status(401).json({ state: false, msg: 'Cliente no encontrado' })
    res.json({ state: true, data: cliente })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente de la base de datos
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       '200':
 *         description: Cliente eliminado exitosamente
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
 *                   example: Cliente eliminado correctamente
 *       '401':
 *         description: Cliente no encontrado
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
 *                   example: Cliente no encontrado
 */
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id)
    if (!cliente) return res.status(401).json({ state: false, msg: 'Cliente no encontrado' })
    res.json({ state: true, msg: 'Cliente eliminado correctamente' })
  } catch (err) {
    res.status(501).send(err.message)
  }
})

module.exports = router
