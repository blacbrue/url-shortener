const ep = require("express")
const csl = require("consola")
const mg = require("mongoose")

/**
 * @param {ep} app
 * @param {csl} consola
 * @param {mg} db
 */

module.exports = (app, consola, db) => {
    consola.info("Loading routes...")

    app.get("/", (req, res) => {
        res.render("index")
    })

    require('./api')(app, consola, db)

    consola.success("Loaded routes.")
}