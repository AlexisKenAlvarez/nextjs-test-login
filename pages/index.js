import { auth, database } from "../components/auth/FirebaseAuth"
import { signOut } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/router"
import { verify } from "jsonwebtoken"

export async function getServerSideProps(context) {

    const secret = process.env.NEXT_PUBLIC_SECRET
    const jwt = context.req.cookies['WebsiteAccessToken']

    const url = context.req.url

    if (url.includes('/')) {
        if (jwt === undefined) {
            console.log('undefined')

            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }
        }

        try {
            verify(jwt, secret);

        } catch (error) {
            console.log(error)
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }
        }
    }


    return {
        props: {
            
        }
    }
}

function Home(props) {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')

    useEffect(() => {

        console.log(props.user)
        fetch("/api/user", { method: "GET" }).then((response) => {
            return response.json()
        }).then((data) => {
            setEmail(data.data.token)

        })

    }, [])



    useEffect(() => {
        auth.onAuthStateChanged(async function (user) {
            if (user) {
                const uid = user.uid
                const docRef = doc(database, "users", uid);
                const docSnap = await getDoc(docRef);
                const docData = docSnap.data()
                console.log(user)

                if (docSnap.exists()) {

                    setUser(docData)
                    console.log("user added")

                }

            } else {
                console.log("No user signed in")
            }
        });
    }, [])


    const logout = async () => {
        await signOut(auth)
        fetch("/api/logout", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).then((response) => {
            router.push("/login")
        })

    }


    return (
        <>
            <h1>Logged in: {email}</h1>
            <h2 onClick={logout}>Sign out</h2>
            <div className="mt-10">

                <div>
                    <h1>{user.email}</h1>
                    <h1>{user.username}</h1>
                    <h1>{user.fullname}</h1>
                    <h1>{user.phone}</h1>
                </div>



            </div>
        </>
    )
}
export default Home
