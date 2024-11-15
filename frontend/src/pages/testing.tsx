
import { useTesting } from "../hooks"
export const Testing= function(){
    const {data}=useTesting();
    return(<div>

{data}
    </div>)
}