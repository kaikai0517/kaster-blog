import Link from "next/link";
import Image from "next/image";
import logo from "../public/Logo.png";
import sun from "../public/sun.svg";
import moon from "../public/moon.svg";
import { useThemeContext } from "../context/theme";

function Header() {
  const [theme, setTheme] = useThemeContext();

  const changTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };
  return (
    <header className="flex p-5 justify-between max-w-7xl mx-auto dark:text-white">
      <div className="flex items-center space-x-5">
        <div>
          <Link href="/">
            <Image
              className="w-44 object-contain cursor-pointer"
              src={logo}
              alt=""
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <Image
          onClick={changTheme}
          className="w-8 h-8 cursor-pointer hover:scale-125"
          src={theme === "dark" ? sun : moon}
          alt=""
        />
      </div>
    </header>
  );
}

export default Header;
