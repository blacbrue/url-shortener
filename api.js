const ep = require("express")
const csl = require("consola")
const mg = require("mongoose")

const codes = require("./models/codes")

/**
 * @param {ep} app
 * @param {csl} consola
 * @param {mg} db
 */

module.exports = (app, consola, db) => {
    consola.info("Loading API...")

    app.get("/api/getCode", async (req, res) => {
        const data = req.query.url
        const code = makeid(6)
        let url

        try {
            url = new URL(data)
        } catch (error) {
            console.error()
            res.status(400).send({
                error: "400: Bad Request",
                message: "The URL you provided is invalid."
            })
            return false
        }

        const codeSchema = await codes.findOne({ url: url.href })

        if (codeSchema) {
            res.status(409).send({
                message: "URL already exists",
                code: codeSchema.code
            })
        } else {
            await codes.create({
                url: url.href,
                code: code
            })

            res.send({ code: code })
        }
    })

    app.get("/:code", async (req, res) => {
        const code = req.params.code
        const codeSchema = await codes.findOne({ code: code })

        if (codeSchema) {
            res.redirect(codeSchema.url)
        } else {
            res.status(404).send({
                error: "404: Not Found",
                message: "The URL you requested does not exist."
            })
        }
    })

    consola.success("Loaded API.")
}

function makeid(length) {
    var result = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}