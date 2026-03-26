require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.static('public'))

// Swagger docs
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// Rutas
app.use('/auth', require('./routes/auth'))
app.use('/clientes', require('./routes/clientes'))
app.use('/pedidos', require('./routes/pedidos'))

// Ruta raíz → sirve la interfaz gráfica
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_ATLAS)
  .then(() => {
    console.log('Conectado a MongoDB Atlas')
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
  })
  .catch(err => console.error('Error al conectar MongoDB:', err.message))
