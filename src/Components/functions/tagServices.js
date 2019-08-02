import axios from 'axios';
const uri = process.env.REACT_APP_NODE_API+"/tags";

export const fn_getAllTags = async ()=>{
    return await axios.get(uri);
};
