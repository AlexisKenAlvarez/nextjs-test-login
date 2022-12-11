import { sign } from "jsonwebtoken"
import { serialize } from "cookie"

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