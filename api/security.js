module.exports = (params) => 
    (req, res, next) => {
        console.log(req.params)
        console.log(req.query)
        console.log(req.body)
        console.log(req)
        console.log(params)
        next()
    }