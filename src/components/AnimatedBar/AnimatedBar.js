import './AnimatedBar.css';

import Marquee from "react-fast-marquee";
function AnimatedBar() {
    return (
        <div className='body'>

            <Marquee pauseOnHover={true} speed={40}>
                <div className='margin'>
                    <a href="#"> Look at latest collection right now</a>
                </div>
                <div className='margin'>
                    <a href="https://www.nike.com/retail">Look Near By Store for pick Up</a>
                </div>
                <div className='margin'>
                    <a href="#">Gear Up use Sports25</a>
                </div>
            </Marquee>

        </div>
    )
}
export default AnimatedBar