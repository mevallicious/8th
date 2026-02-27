import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthDataContext } from '../context/AuthContext'
import "../styles/Login.css"
const SignUp = () => {


    const data = useContext(AuthDataContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const navigate = useNavigate()

    const submitHandler = (e)=>{
        e.preventDefault()
        console.log("submitted")
        setEmail('')
        setName('')
        setPassword('')

        data.signIn()

    }
    
    
    return (
        <div>
        <button onClick={()=>{
            navigate('/login')
        }} className="login-btn">Login</button>
        <button onClick={()=>{
            navigate('/')
        }} className="back-btn">Back</button>
        <div className='signup-form'>
            <form  onSubmit={(e)=>{
                submitHandler(e)
                navigate('/')
            }}>
                <h1>New User</h1>
            <input onChange={(e)=>{
                setName(e.target.value)
            }}
            value={name}
            required
            type="text" placeholder='enter name' />

            <input onChange={(e)=>{
                setEmail(e.target.value)
            }}
            value={email}
            required
            type="email" placeholder='enter email' />

            <input onChange={(e)=>{
                setPassword(e.target.value)
            }}
            required
            value={password}
            type="password" placeholder='enter password' />

            <button>Signup</button>

            <p>Already have an account? <Link to='/login'>Login</Link></p>
        </form>
        </div>
    </div>
  )
}

export default SignUp