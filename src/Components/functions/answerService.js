import axios from "axios";
const uri = process.env.REACT_APP_NODE_API+"/answers";
export const fn_addAnswer = async (id,headers,data)=>{
    return await axios.post(`${uri}/${id}`,data,headers);
};
export const fn_getAnswerByQID = async (qid)=>{
    return await axios.get(`${uri}/qid/${qid}`)
};
export const fn_getAnswerByQIDUpdated = async (qid)=>{
    return await axios.get(`${uri}/updated/${qid}`)
};
export const fn_addCommentForAnswer = async (id,headers,data)=>{
    return await axios.patch(`${uri}/comment/${id}`,data,headers);
};
export const fn_downVoteAnswer = async (id,headers)=>{
    return await axios.patch(`${uri}/downvote/${id}`,null,headers);
};
export const fn_upVoteAnswer = async (id,headers)=>{
    return await axios.patch(`${uri}/upvote/${id}`,null,headers);
};
export const fn_updateAnswer = async (id,data,headers)=>{
    return await axios.put(`${uri}/${id}`,data,headers);
};
export const fn_deleteAnswer = async (id,headers)=>{
    return await axios.delete(`${uri}/${id}`,headers);
};
export const fn_makeBestAnswer = async (id,headers)=>{
    return await axios.put(`${uri}/best/${id}`,null,headers);
};
export const fn_getAnswerByUID = async (id)=>{
    return await axios.get(`${uri}/user/${id}`);
};
export const fn_getBestAnswerByUID = async (id)=>{
    return await axios.get(`${uri}/bestanswer/user/${id}`);
};
