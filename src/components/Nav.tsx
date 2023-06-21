import { Button } from "./ui/Button";

const Nav = () => {
  return (
    <nav className="h-12 text-primary bg-[#282a36] py-12 flex items-center justify-between flex-wrap bg-teal p-6">
      <div className="flex items-center flex-no-shrink text-white mr-6">
        <Button>Hello</Button>
      </div>
    </nav>
  );
};

export default Nav;
