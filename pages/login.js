import Link from "next/link"
import { useRouter } from "next/router"
import { FormInput } from "../components/FormInput"
import { useState, useEffect } from "react"
import { auth } from "../components/auth/FirebaseAuth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { verify } from "jsonwebtoken"

export async function getServerSideProps(context) {
  const secret = process.env.NEXT_PUBLIC_SECRET
  const jwt = context.req.cookies['WebsiteAccessToken']

  const url = context.req.url

  if (url.includes('/login')) {

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
      name: "password",
      label: "password",
      type: "password"
    }
  ]

  return {
    props: {
      inputs
    }
  }
}

function Login(props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const navigateRegister = () => {
    router.push("/register")
  }

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setValues(val => ({ ...val, [e.target.name]: e.target.value }))
  }

  const submit = async () => {

    signInWithEmailAndPassword(auth, values.email, values.password).then((response) => {

      fetch("/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ token: response.user.email })

      }).then((response) => {
        router.push("/")
      })


    }).catch((err) => {
      console.log(err)
    })

  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto flex flex-col">
        <div className="absolute top-5 right-5 w-fit bg-slate-500 text-white p-2 px-6 rounded cursor-pointer hover:bg-slate-700" onClick={navigateRegister}>
          Register
        </div>
        <div className="w-48 mx-auto mt-24">
          <h1 className="text-center font-bold">Login Section</h1>
          {props.inputs.map(items => {
            return (
              <FormInput key={items.id} {...items} value={values[items.name]} onChange={handleChange} />
            )
          })}

          <div className="mt-6 w-full bg-slate-500 text-white h-8 flex justify-center items-center rounded hover:bg-slate-700 cursor-pointer" onClick={submit}>
            Log in
          </div>
        </div>

      </div>

    </>
  )

}

export default Login