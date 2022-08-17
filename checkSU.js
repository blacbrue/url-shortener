const ep = require("express")
const csl = require("consola")
const mg = require("mongoose")
const { default: axios } = require("axios")

const codes = require("./models/codes")

/**
 * @param {ep} app
 * @param {csl} consola
 * @param {mg} db
 */

module.exports = (app, consola, db) => {
    async function findURL() {
        consola.info("Checking the status of shortened URLs...")

        const urls = []

        await codes.find({}, (err, res) => {
            if (err) throw err;

            if (res.length === 0) {
                consola.info("[URL Checking] No shortened URLs found.")
                return
            }

            res.forEach(data => {
                urls.push(data.url)
            })

        }).clone().catch((err) => console.error(err))

        urls.forEach(async (url) => {
            await axios.get(url).then(async (res) => {
                if (res.status === 200) {
                    consola.success(`[URL Checking] ${url} exists. (HTTP 200)`)
                }
            }).catch(async (err) => {
                // console.log(err)
                if (err.statusCode === 404 || err.code === "ENOTFOUND" || err.config.data === undefined || err.response.status === 404) {
                    consola.error(`[URL Checking] ${err.config.url} does not exist. Deleting in database. (HTTP 404)`)
                    await codes.findOneAndDelete({ url: err.config.url })
                }
            })
        })

        consola.success("[URL Checking] Checked the status of shortened URLs.")
    }

    findURL()
    setInterval(findURL, 86400000)
    // setInterval(findURL, 20000) for testing
}