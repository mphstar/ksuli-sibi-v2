import HeaderPage from "../organisms/HeaderPage";
import FooterPage from "../organisms/FooterPage";
import saveVisitor from "@/services/visitor";

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  saveVisitor();

  return (
    <div className="flex flex-col min-h-svh bg-ground">
      <HeaderPage />
      <main className="flex flex-col flex-1 container max-w-[1200px]">
        {children}
      </main>
      <FooterPage />
    </div>
  );
};

export default LayoutPage;
