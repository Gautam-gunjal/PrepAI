import axios from "axios"

export async function register({username,email,password}){

        const res = await axios.post("http://localhost:3000/api/auth/register",{username,email,password},{withCredentials:true})
        return res.data                
}

export async function login({email,password}) {
            const res = await axios.post('http://localhost:3000/api/auth/login',{email,password},{withCredentials:true})
            return res.data;    
}

export async function logout(){
    try{
        const res = await axios.get('http://localhost:3000/api/auth/logout',{withCredentials:true})
        return res.data
    }catch(err){
        console.log(err)
    }
}

export async function getme(){
    try{
        const res = await axios.get('http://localhost:3000/api/auth/get-me',{withCredentials:true})
        return res.data
    }catch(err)
    {
        console.log(err);
        
    }
}
