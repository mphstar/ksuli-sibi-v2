"use client";

import useNavbarStore from "@/stores/NavbarStore";
import NavLink from "../molecules/NavLink";
import { cn } from "@/lib/utils";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect } from "react";
import saveVisitor from "@/services/visitor";

const HeaderPage = () => {
  const navStore = useNavbarStore();

  useEffect(() => {
    // saveVisitor();
    navStore.navSelected = "home";
  }, []);

  return (
    <div className="bg-white drop-shadow w-full h-fit sticky top-0 z-[300]">
      <header className="flex flex-row items-center gap-2 justify-between px-4 py-3 container max-w-[1200px]">
        <div className="flex gap-1 items-center">
          <img
            className="w-10"
            src="/assets/images/logo.png"
            alt="Logo Kedai Susu Tuli"
          />
          <div className="form-control">
            <h1 className="font-semibold">K-SULI</h1>
            <p className="text-gray-600">Kedai Susu Tuli</p>
          </div>
        </div>
        <ul
          className={cn(
            "flex md:flex-row flex-col items-center justify-center fixed md:static min-h-svh md:min-h-0 w-full md:w-fit bg-white/50 md:bg-transparent md:backdrop-blur-none backdrop-blur-md z-[999] top-0 left-0",
            navStore.isOpen ? "translate-y-0" : "-translate-y-full",
            "duration-300 ease-in-out md:translate-y-0"
          )}
        >
          <div
            onClick={() => navStore.toggle()}
            className="btn absolute top-4 right-4 md:hidden bg-transparent border-none"
          >
            <IoClose />
          </div>
          <NavLink
            href="/"
            name="Home"
            isActive={navStore.navSelected === "home"}
          />
          <NavLink
            href="/kamus"
            name="Kamus"
            isActive={navStore.navSelected === "kamus"}
          />
          <NavLink
            href="/"
            name="Kuis"
            isActive={navStore.navSelected === "kuis"}
          />
        </ul>
        <button
          onClick={() => navStore.toggle()}
          className="btn bg-transparent border-none md:hidden"
        >
          <RxHamburgerMenu />
        </button>
      </header>
    </div>
  );
};

export default HeaderPage;
