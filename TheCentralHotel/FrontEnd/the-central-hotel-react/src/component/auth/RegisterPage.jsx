import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import APIService from '../../service/APIService'
import  {toastSuccess} from "../../service/ToastService"

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit =async (e)=>{
        e.preventDefault()
        validateInput()
        try{
            if(passwordMatch()){
                const response = await APIService.register({email, password, name, phoneNumber}) // 
                if(response.statusCode ===200){
                    toastSuccess("User successfully registered")
                    
                    setTimeout(()=>{
                        navigate("/login") 
                    }, 5000)
                }
            }else{
                setError("Passwords must match")
                setTimeout(()=> setError(""), 5000)
            }
            
        }catch(err){
            setError(err.response?.data?.message || error.message)
            setTimeout(()=> setError(""), 5000)

        }
    }
    const validateInput = ()=> {
        if(!email || !password || !name || !phoneNumber){
            setError('Please fill all the fields')
            setTimeout(()=> setError(""), 5000)
            return;
        }
    }
    const passwordMatch = ()=>{

        return confirmPassword===password
    }
  return (
      <div className="auth-container">
          <h2>Register</h2>
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
              <div className="form-group">
                  <label >Confirm Password: </label>
                  <input type="password"
                      value={confirmPassword}
                      onChange={(e)=>setConfirmPassword(e.target.value)} 
                      required />
              </div>
              <div className="form-group">
                  <label >Name: </label>
                  <input type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required />
              </div>
              <div className="form-group">
                  <label >Phone number: </label>
                  <input type="number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required />
              </div>
              <button type='submit'>Register</button>
          </form>
          <p className='register-link'></p>
          Already have an account? <a href='/login'> Login</a>
      </div>
  )
}

export default RegisterPage