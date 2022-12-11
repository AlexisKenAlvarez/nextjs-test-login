import Link from "next/link"
import { useEffect } from "react";

import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../components/auth/FirebaseAuth";

function Verified() {

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            signInWithEmailLink(auth, email, window.location.href)
                .then((result) => {

                    window.localStorage.removeItem('emailForSignIn');

                })
                .catch((error) => {
                    console.log(error)
                });
        }


    }, [])

    return (
        <>
            <div className="max-w-[1600px] mx-auto mt-16">
                <h1 className="text-center">
                    Your account has been verified!
                </h1>

                <div className="w-fit mx-auto mt-5 cursor-pointer">
                    <Link href="/home">
                        Click here to redirect
                    </Link>
                </div>

            </div>

        </>

    )
}

export default Verified