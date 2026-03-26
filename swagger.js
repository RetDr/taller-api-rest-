const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Gestión de Pedidos',
    version: '1.0.0',
    description: 'API RESTful para la gestión de clientes y pedidos con autenticación JWT',
    contact: {
      name: 'Daniel',
      url: 'https://uptc.edu.co'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
