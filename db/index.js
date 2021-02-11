const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/treehouse');

//this creates the users table
const Skater = db.define('skater', {
    //id's seem to be automatic, do we ever need to create them?
    // id: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    // },
    name: {
        type: Sequelize.STRING, //can use destructuring and type const {STRING} = Sequelize above and here I would have type: STRING instead of type: Sequelize.STRING
        allowNull: false
    },
    pictureUrl: Sequelize.STRING,
});


//USING HOOKS...will run every time we insert a skater
Skater.beforeSave((skater) => {
    console.log("hook", skater)
    if (!skater.pictureUrl) {
        skater.pictureUrl = 'test_image'
    }
})


const syncAndSeed = async() => {
    await db.sync({force: true})
}
//#region what is sync({force: true})?
//Calling sync() issues a CREATE TABLE IF NOT EXISTS statement, which will sync all models and create tables that do not exist in the database. In development (or testing), you may want to refresh your database tables each time you start your app. For this, the sync() method accepts an object with a force parameter that lets you control the database synchronization. Calling sync({ force: true }) issues a DROP TABLE IF EXISTS statement, which completely deletes the table, before issuing the CREATE TABLE IF NOT EXISTS statement. In other words, it will drop a table that exists, each time you start your app, and recreate it from the model definition.

//sync = CREATE TABLE IF NOT EXISTS
//({force: true}) = DROP TABLE IF EXISTS
//#endregion

module.exports = {
    db,
    syncAndSeed,
    models: {
        Skater
    }
}


