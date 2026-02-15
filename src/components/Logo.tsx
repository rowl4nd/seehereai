import { Link } from "react-router-dom";
import logo from "@/assets/see-here-header-logo-new.png";

interface LogoProps {
  to?: string;
}

const Logo = ({ to = "/" }: LogoProps) => {
  return (
    <Link to={to} className="inline-block hover:opacity-80 transition-opacity">
      <img alt="see here" style={{ height: '51px' }} className="w-auto" src={logo} />
    </Link>);

};

export default Logo;