import axios from 'axios';
const uri = process.env.REACT_APP_NODE_API+"/background";

export const fn_getimage = async function () {
    return await axios.get(`${uri}/today/random`);
};
