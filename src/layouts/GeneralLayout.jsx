import { Outlet } from "react-router";
import GeneralFooter from "../components/GeneralFooter";
import { GeneralHeader } from "../components/GeneralHeader";

const GeneralLayout = () => {
 
  return (
    <div>
      <GeneralHeader />
      <Outlet />
      <GeneralFooter />
    </div>
  );
};

export default GeneralLayout;
