require('dotenv').config()
const request = require('request')
const { WEBSUB_HUB } = process.env
exports.handler = function(event, context, callback) {
  if (typeof WEBSUB_HUB == 'undefined') {
    console.log("[WebSub] Define WEBSUB_HUB environment variable to enable ping")
    process.env.SILENCE_EMPTY_LAMBDA_WARNING = true
    callback(null, {statusCode: 204})
  } else {
    var e = JSON.parse(event.body)
    if (e.payload.context == "production") {
      console.log("[WebSub] preparing to ping " + WEBSUB_HUB)
      request.post(
        WEBSUB_HUB + "?hub.mode=publish&hub.url=" + e.payload.url + "/*",
        function (error, response, body){
          if (!error && response.statusCode == 204) {
            console.log("[WebSub] ping successful")
            callback(null, {statusCode: 204})
          } else {
            console.log("[WebSub] ping failed:", error)
            callback(error, {statusCode: response.statusCode})
          }
        }
      )
    } else {
      console.log("[WebSub] ping to " + WEBSUB_HUB + " suppressed in " + e.payload.context + " context")
      process.env.SILENCE_EMPTY_LAMBDA_WARNING = true
      callback(null, {statusCode: 204})
    }
  }
}
