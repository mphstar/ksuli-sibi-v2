import { cn } from "@/lib/utils";
import Link from "next/link";

type NavLinkProps = {
  href: string;
  name: string;
  isActive: boolean;
};

const NavLink = ({ href, name, isActive }: NavLinkProps) => {
  return (
    <Link href={href}>
      <li
        className={cn(
          "btn bg-transparent border-none",
          isActive ? "text-primary" : ""
        )}
      >
        {name}
      </li>
    </Link>
  );
};

export default NavLink;
