import { Link } from "react-router-dom";
import logo from "@/assets/see-here-header-logo.png";

interface LogoProps {
  to?: string;
}

const Logo = ({ to = "/" }: LogoProps) => {
  return (
    <Link to={to} className="inline-block hover:opacity-80 transition-opacity">
      <img src={logo} alt="see here" style={{ height: '60px' }} className="w-auto" />
    </Link>
  );
};

export default Logo;
