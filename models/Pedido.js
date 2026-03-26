const mongoose = require('mongoose')

const productoPedidoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  }
})

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  productos: [productoPedidoSchema],
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  total: {
    type: Number,
    default: 0
  },
  observaciones: {
    type: String,
    default: ''
  }
}, { timestamps: true })

// Calcular total automáticamente antes de guardar
pedidoSchema.pre('save', async function () {
  this.total = this.productos.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0)
})

module.exports = mongoose.model('Pedido', pedidoSchema)
