import React, { createContext, useEffect, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthDataContext =  createContext()

const AuthContext = (props) => {

    const storedUser = JSON.parse(localStorage.getItem("allUserData")) || []
    const [allUsers, setAllUsers] = useState(storedUser)
    
    const loggedUser = JSON.parse(localStorage.getItem("LoginUserData")) || null
    const [loginUser, setLoginUser] = useState(loggedUser)


    useEffect(()=>{
        localStorage.setItem("allUserData",JSON.stringify(allUsers))
    },[allUsers])

    useEffect(()=>{
        localStorage.setItem("LoginUserData", JSON.stringify(loginUser))
    },[loginUser])


    function signIn(name,email,password){

        let newUsers = [...allUsers]
        newUsers.push({name,email,password})
        setAllUsers(newUsers)
        setLoginUser({name,email,password})
        return true
    }

    function loginFunc(email,password){
        let matchedUser = allUsers.find((elem)=>elem.email === email && elem.password === password)

        if(!matchedUser) return false 
        
        setLoginUser(matchedUser)   

        return true 
    }

    function logout(){
        setLoginUser(null)
    }


  return (
    <AuthDataContext.Provider value={{ allUsers, loginUser, signIn, loginFunc, logout }}
>
        {props.children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext