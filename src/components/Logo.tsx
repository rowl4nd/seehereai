import { Link } from "react-router-dom";
import logo from "@/assets/see-here-logo.png";

interface LogoProps {
  to?: string;
}

const Logo = ({ to = "/" }: LogoProps) => {
  return (
    <Link to={to} className="inline-block hover:opacity-80 transition-opacity">
      <img src={logo} alt="see here" className="h-24 w-auto" />
    </Link>
  );
};

export default Logo;
