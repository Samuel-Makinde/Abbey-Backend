const whiteList = ["http://localhost:5173",  "http://localhost:5174", "https://abbey-interview.netlify.app"]


const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Access denied by cors"))
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
    credentials: true,
}


module.exports = corsOptions;