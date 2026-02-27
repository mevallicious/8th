import React, { useContext,  useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthDataContext } from '../context/AuthContext'
import "../styles/login.css"

const Login = () => {

    const data = useContext(AuthDataContext)

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPass, setLoginPass] = useState('')

    const submitHandler = (e)=>{
        e.preventDefault()
        console.log("submitted")
        setLoginEmail('')  
        setLoginPass('')  

        if(data.loginFunc(loginEmail,loginPass)){
            navigate('/')
        }
        else alert('emil or password is wrong')
    }

    const navigate = useNavigate()


    return (
        <div>
            <button onClick={()=>{
                navigate('/signin')
            }} className="signup-btn">Signup</button>
            <button onClick={()=>{
            navigate('/')
        }} className="back-btn">Back</button>
            <div className='login-form'>
                <form  onSubmit={(e)=>{submitHandler(e)}}>
                    <h1>Welcome Back!</h1>
                <input onChange={(e)=>{
                    setLoginEmail(e.target.value)
                }}
                value={loginEmail}
                type="email" placeholder='enter name' />

                <input onChange={(e)=>{
                    setLoginPass(e.target.value)
                }}
                value={loginPass}
                type="password" placeholder='enter password' />

                <button>Login</button>

                <p>Dont have an account? <Link to='/signin'>Sign up</Link></p>
            </form>
            </div>
        </div>
    )
}

export default Login