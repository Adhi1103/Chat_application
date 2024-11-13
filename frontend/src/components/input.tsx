import { ChangeEvent} from "react";

interface Label_input {
    placeholder: string;
    label: string;
    type?:string;
    OnChange: (e:ChangeEvent<HTMLInputElement>)=>void
}
export const Input=function({placeholder,label,type,OnChange}:Label_input){
  
    return(<>
<div className="w-full max-w-[380px] mt-[10px] font-bold">{label}</div>
<div className="w-full max-w-[380px] mt-[10px] h-10"><input className="pl-3 w-full h-full border-solid border-2 border-slate-200 rounded" required type={type||"text"} onChange={OnChange} placeholder={placeholder}></input></div>
    </>)

}