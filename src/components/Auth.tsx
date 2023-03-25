import React, {useState} from "react";
import {auth, googleProvider} from "../config/firebase-config"
import {createUserWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";

/* Uma collection é como se fosse uma tabela em um banco SQL, e um "document" é como se fosse uma linha em
* uma tabela SQL. */

export const Auth = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    /* Muitos métodos do Firebase retornam promises. */
    const signIn = async () => {
        try {
            /* O parâmetro "auth" diz que utilizaremos o módulo de autenticação do nosso projeto. */
            await createUserWithEmailAndPassword(auth, email, password)
        }catch(err: any){
            console.error(err.message)
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        }catch(err :any){
            console.error(err.message)
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        }catch(err: any){
            console.error(err.message)
        }
    }

    /* Conseguimos obter o email do usuário logado com a variável "auth". */
    console.log(auth.currentUser?.email)

    return (
        <div>
            <input placeholder={"Email..."} onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder={"Password..."} type="password" onChange={(e) => setPassword(e.target.value)}/>

            <button onClick={signIn}>Sign In</button>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
