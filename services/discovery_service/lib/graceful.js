function gracefulShutdown(server){
    process.on("SIGTERM", () => {
        console.log("Terminating gracefully.")
        server.close(() => {
            console.log("Service shutdown.")
            process.exit(0)
        });
    })
    
    process.on("SIGINT", () => {
        console.log("Terminating gracefully.")
        server.close(() => {
            console.log("Service shutdown.")
            process.exit(0)
        });
    })
}

module.exports = gracefulShutdown