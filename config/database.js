module.exports = {
    database: 'mongodb://kristi123:kristi123@book-collection-shard-00-00.sa5fn.mongodb.net:27017,book-collection-shard-00-01.sa5fn.mongodb.net:27017,book-collection-shard-00-02.sa5fn.mongodb.net:27017/book-collection?ssl=true&replicaSet=atlas-oj8l04-shard-0&authSource=admin&retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'secret1'
}