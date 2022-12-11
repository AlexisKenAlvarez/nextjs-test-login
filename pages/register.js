import { useRouter } from "next/router"
import { FormInput } from "../components/FormInput"
import { useState } from "react"
import { createUserWithEmailAndPassword, sendSignInLinkToEmail, getAuth } from "firebase/auth"
import { auth, database, actionCodeSettings } from "../components/auth/FirebaseAuth"
import { collection, setDoc, doc } from "firebase/firestore"
import { verify } from "jsonwebtoken"

export async function getServerSideProps(context) {
    const secret = process.env.NEXT_PUBLIC_SECRET
    const jwt = context.req.cookies['WebsiteAccessToken']
  
    const url = context.req.url
  
    if (url.includes('/register')) {
  
      try {
        verify(jwt, secret);
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
  
      } catch (error) {
        console.log(error)
      
      }
    }

    const inputs = [
        {
            id: 1,
            name: "email",
            label: "email",
            type: "text"
        },
        {
            id: 2,
            name: "username",
            label: "username",
            type: "text"
        },
        {
            id: 3,
            name: "fullname",
            label: "Fullname",
            type: "text"
        },
        {
            id: 4,
            name: "phone",
            label: "Phone number",
            type: "text"
        },
        {
            id: 5,
            name: "facebook",
            label: "facebook link",
            type: "text"
        },
        {
            id: 6,
            name: "password",
            label: "password",
            type: "password"
        },
        {
            id: 7,
            name: "confirm",
            label: "confirm password",
            type: "password"
        },

    ]
  
    return {
        props: {
            inputs
        }
    }
  }


function Register(props) {
    const router = useRouter()
    const db = collection(database, 'users')

    const navigateLogin = () => {
        router.push("/")
    }

    const [values, setValues] = useState({
        email: '',
        username: '',
        fullname: '',
        phone: '',
        facebook: '',
        password: '',
        confirm: ''
    })

    const handleChange = (e) => {
        setValues(val => ({ ...val, [e.target.name]: e.target.value }))
    }


    const register = async () => {

        sendSignInLinkToEmail(auth, values.email, actionCodeSettings)
            .then(() => {
                console.log("Email link sent")
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem('emailForSignIn', values.email);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });

        try {
            const user = await createUserWithEmailAndPassword(auth, values.email, values.password)

            await setDoc(doc(database, "users", user._tokenResponse.localId), {
                username: values.username,
                email: values.email,
                fullname: values.fullname,
                phone: values.phone,
                facebook: values.facebook
            }).then(() => {
                console.log(user)
                console.log("Added user credentials")
            }).catch((err) => {
                console.log(err)
            })

            console.log(user)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="max-w-[1400px] mx-auto flex flex-col">
                <div className="absolute top-5 right-5 w-fit bg-slate-500 text-white p-2 px-6 rounded cursor-pointer hover:bg-slate-700" onClick={navigateLogin}>
                    Login
                </div>
                <div className="w-48 mx-auto mt-24">
                    <h1 className="text-center font-bold">Register Section</h1>

                    {props.inputs.map(items => {
                        return (
                            <FormInput key={items.id} {...items} value={values[items.name]} onChange={handleChange} />
                        )
                    })}

                    <div className="mt-6 w-full bg-slate-500 text-white h-8 flex justify-center items-center rounded hover:bg-slate-700 cursor-pointer" onClick={register}>
                        Create your account
                    </div>
                </div>

            </div>

        </>
    )

}

export default Register