import { SiJordan } from "react-icons/si";
import { GiAlliedStar } from "react-icons/gi";
import './UpperBar.css';
import { useNavigate } from "react-router-dom";

function UpperBar() {

  const navigate = useNavigate();
  return <>
  <div className="align">
  <div>
   <SiJordan className="icons"/>
   <GiAlliedStar className="icons" />
   </div>

   <div className="links">
    <a href="https://www.nike.com/retail" >Find a Store  | </a>
    <a href="#">Help  | </a>
    <a onClick={()=>navigate('auth')}>Join us | </a>
    <a onClick={()=>navigate('auth')} >Sign in </a>
   </div>
 </div>
  </>
    
  
}

export default UpperBar