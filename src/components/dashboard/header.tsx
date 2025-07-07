import { MaterialSymbolsCloseSmall, SolarHamburgerMenuOutline } from "../icons";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (arg: (val: boolean) => boolean) => void;
  name: string;
  role: string;
}

const Navbar = (props: NavbarProps) => {
  return (
    <nav className="py-1 px-4 w-full bg-[#f0f1f5] flex items-center gap-2">
      <div className="md:hidden">
        {props.isOpen ? (
          <MaterialSymbolsCloseSmall
            className="text-xl"
            onClick={() => props.setIsOpen((val) => !val)}
          />
        ) : (
          <SolarHamburgerMenuOutline
            className="text-xl"
            onClick={() => props.setIsOpen((val) => !val)}
          />
        )}
      </div>

      <div className="grow"></div>
      <div className="leading-3">
        <p className="font-semibold text-sm">{props.name}</p>
        <p className="font-normal text-xs text-gray-500 leading-3">{props.role}</p>
      </div>
      <div className="rounded-full bg-[#172e57] shrink-0 h-8 w-8 grid place-items-center text-lg font-semibold text-white">
        {props.name.toString().charAt(0).toUpperCase()}
      </div>
    </nav>
  );
};

export default Navbar;
