import { Link } from "react-router-dom";
import logo from "@/assets/see-here-header-logo-new.png";

interface LogoProps {
  to?: string;
}

const Logo = ({ to = "/" }: LogoProps) => {
  return (
    <Link to={to} className="inline-block hover:opacity-80 transition-opacity">
      <img alt="see here" style={{ height: '48px' }} className="w-auto" src="/lovable-uploads/4d53de4d-7165-4e86-b3e1-27a9ccf7ff35.png" />
    </Link>);

};

export default Logo;