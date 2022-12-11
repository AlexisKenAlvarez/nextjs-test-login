import cookie from "cookie"

export default (req, res) => {
    res.json({ data: req.cookies })
}