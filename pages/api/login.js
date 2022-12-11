import cookie from "cookie"
import { sign } from "jsonwebtoken"
import { serialize } from "cookie"

// export default (req, res) => {
//     res.setHeader("Set-Cookie", 
//     cookie.serialize("token", req.body.token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== 'development',
//         maxAge: 60 * 60 * 1,
//         sameSite: "strict",
//         path: '/'
//     }))
//     req.cookies.token = req.body.token
//     res.statusCode = 200
//     res.json({success: true})

// }

const secret = process.env.NEXT_PUBLIC_SECRET

export default async function (req, res) {
    const token = sign(
        {
            exp: Math.floor(Date.now() / 1000) * 60 * 60 * 24 * 30,
            username: req.body.token
        },
        secret
    )

    const serialized = serialize("WebsiteAccessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        maxAge: 60 * 60 * 1,
        path: '/'
    })

    res.setHeader('Set-Cookie', serialized)
    res.status(200).json({message: 'success'})
}