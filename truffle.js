module.exports = {
    build: {
        "index.html": "index.html",
        "newSensor.html": "newSensor.html",
        "app.js": [
            "javascripts/app.js"
        ],
        "app.css": [
            "stylesheets/app.css"
        ],
        "images/": "images/"
    },
    deploy: [
        "SimpleDataMarket"
    ],
    rpc: {
        host: "localhost",
        port: 8545
    }
};
