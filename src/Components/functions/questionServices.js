import axios from 'axios';
const uri = process.env.REACT_APP_NODE_API+"/questions";

export const fn_addNewQuestion = async (headers,data)=>{
    return await axios.post(uri,data,headers);
};
export const fn_getAllQuestions = async ()=>{
    return await axios.get(uri);
};
export const fn_getQuestionByName = async (name)=>{
    return await axios.get(`${uri}/${name}`);
};
export const fn_upVoteQuestion = async (id,headers)=>{
    return await axios.patch(`${uri}/upvote/${id}`,null,headers);
};
export const fn_downVoteQuestion = async (id,headers)=>{
    return await axios.patch(`${uri}/downvote/${id}`,null,headers);
};
export const fn_updateViews = async (question)=>{
    return await axios.patch(`${uri}/views/${question}`);
};
export const fn_getQuestionByID = async (id)=>{
    return await axios.get(`${uri}/id/${id}`);
};
export const fn_followQuestion = async (id,headers)=>{
    return await axios.patch(`${uri}/follow/${id}`,null,headers);
};
export const fn_addComment = async (id,headers,data)=>{
    return await axios.patch(`${uri}/comment/${id}`,data,headers);
};
export const fn_delete = async (id,headers)=>{
    return await axios.delete(`${uri}/${id}`,headers);
};
export const fn_updateQuestion = async (id,data,headers)=>{
    return await axios.put(`${uri}/${id}`,data,headers);
};
export const fn_search = async (keyword)=>{
    return await axios.get(`${uri}/search/${keyword}`);
};
export const fn_getQuestionByTag = async (tag)=>{
    return await axios.get(`${uri}/tag/${tag}`);
};
export const fn_getQuestionByAsk = async (from)=>{
    return await axios.get(`${uri}/asked/${from}`);
};
export const fn_getQuestionByUID = async (id)=>{
    return await axios.get(`${uri}/user/${id}`);
};
