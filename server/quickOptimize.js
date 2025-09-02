// Add this to your MongoDB directly or through MongoDB Compass
// Run these commands in MongoDB shell:

db.products.createIndex({ "_id": -1 })
db.products.createIndex({ "name": 1 })
db.products.createIndex({ "addedBy": 1 })
db.products.createIndex({ "finalprice": 1 })
db.products.createIndex({ "discount": -1 })

console.log("Run these commands in MongoDB shell to optimize queries");