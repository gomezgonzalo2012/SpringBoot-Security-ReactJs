import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import APIService from '../../service/APIService'

const LoginPage =() => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || "/home"
    const handleSubmit =async (e)=>{
        e.preventDefault()
        if(!email || !password){
            setError('Please fill all the fields')
            setTimeout(()=> setError(""), 5000)
            return;
        }
        try{
            
            const response = await APIService.login({email, password}) // login() requiere de un objeto 

            if(response.statusCode ===200){
                localStorage.setItem("token", response.token)
                localStorage.setItem("role", response.role)
                navigate(from, {replace : true}) //??
            }
            
        }catch(err){
            setError(err.response?.data?.message || error.message)
            setTimeout(()=> setError(""), 5000)

        }
    }
  return (
      <div className="auth-container">
          <h2>Login</h2>
          {error && <p className='error-message'>{error}</p>}
          <form onSubmit={handleSubmit}>
              <div className="form-group">
                  <label >Email: </label>
                  <input type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required />
              </div>
              <div className="form-group">
                  <label >Password: </label>
                  <input type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required />
              </div>
              <button type='submit'>Login</button>
          </form>
          <p className='register-link'></p>
          Don't have an account? <a href='/register'> Register</a>
      </div>
  )
}

export default LoginPage