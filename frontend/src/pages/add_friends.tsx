import {useState,useEffect} from "react";
import { useFriends } from "../hooks";
import {User} from "../components/user"
import { AppBar } from "../components/app_bar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { User_Skeleton } from "../components/user_skeleton";
interface Users{
    username:string
}
export const AddFriend=function(){
    const {loading}=useFriends();
    const [users,setUsers]=useState<Users[]>([]);
    const [value,setvalue]=useState("");
const user=localStorage.getItem("username");
console.log(user);
        useEffect(function(){
            const token=localStorage.getItem("JWT");
const response=axios.get(`${BACKEND_URL}/api/v1/user/bulk?name=${value}`,{ headers: {
    'Authorization': token
}});
response.then(function(value){
    console.log(value.data.users);
    setUsers(value.data.users);
});
        },[value]);

    return(<div>
        <AppBar name={user||"?"} label="Message"></AppBar>
 <div className="font-bold mt-6 text-lg text-center">
            Search users to add friend request
        </div>
        <div className="my-2">
            <input onChange={function(e){
        setvalue(e.target.value);
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        {loading?<div><User_Skeleton></User_Skeleton>
        <User_Skeleton></User_Skeleton>
        <User_Skeleton></User_Skeleton>
        <User_Skeleton></User_Skeleton>
        <User_Skeleton></User_Skeleton>
</div>
           : users.map(function(user){
                return (<User username={user.username}></User>)
            })}
        

    </div>)}
