import axios from 'axios';
const uri = process.env.REACT_APP_NODE_API+"/users";
// let headers = {
//     headers: {
//         "CSRF-Token": "test",
//     }
// };
export const fn_signup = async (data)=>{
    return await axios.post(uri,data)
};
export const fn_usernameValidator = async (username)=>{
    return await axios.get(`${uri}/validator/username/${username}`)
};
export const fn_emailValidator = async (email)=>{
    return await axios.get(`${uri}/validator/email/${email}`)
};
export const fn_resendCode =  async (_id)=>{
    return await axios.patch(`${uri}/resend/${_id}`)
};
export const fn_validateCode =  async (_id,body)=>{
    return await axios.put(`${uri}/code/${_id}`,body)
};
export const fn_login = async (payload)=>{
    return await axios.post(`${uri}/login`,payload)
};
export const fn_sendResetPasswordLink = async  (email)=>{
    return await axios.put(`${uri}/resetpassword/${email}`)
};

export const fn_validate_resetPassword = async (hash,shortID)=>{
    return await axios.get(`${uri}/resetpassword/${hash}/${shortID}`)
};
export const fn_changePassword = async (id,payload)=>{
    return await axios.put(`${uri}/password/${id}`,payload)
};
export const fn_0authCheck = async (email)=>{
    return await axios.post(`${uri}/auth/check/${email}`)
};
export const fn_0authSignup = async (payload)=>{
    return await axios.post(`${uri}/auth/signUp`,payload)
};
export const fn_getUserByUSername = async(username)=>{
    return await axios.get(`${uri}/user/${username}`)
};
export const fn_updateProfile = async (id,payload,headers)=>{
    return await axios.put(`${uri}/${id}`,payload,headers)
};
