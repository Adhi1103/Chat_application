import { Link } from "react-router-dom"
import { Avatar } from "./avatar.tsx"
interface Name{
    name:string,
    label:string
}
export const  AppBar=function({name,label}:Name){
  
    return(<>
    <div className="flex flex-row justify-between  mr-[20px] ml-[20px]">
<div className="text-[20px] mt-[10px]"><Link to={"/friends"}>Chat-APP</Link></div>

<div className="flex flex-row ">
    <Link to="/add/friends"><div className=" mr-[60px] mt-[10px]"><button className="bg-green-500 pb-[2px] rounded-xl text-white hover:bg-green-600  w-[100px] h-[30px]">
{label}
</button></div></Link>

<div className="mt-[10px]"><Avatar name={name} ></Avatar></div>

</div>
    </div>
    <div className="bg-slate-100  w-full h-0.5 mt-[15px]"></div>
    </>)
}