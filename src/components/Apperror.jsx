import { CiCloudOff } from "react-icons/ci";

const AppError = ({ error }) => {
  return (
    <div className="h-[50vh] rounded-lg flex flex-col items-center justify-center text-red-600 dark:text-red-400 font-bold text-center w-full px-4  mx-auto">
      <CiCloudOff size={150} className="opacity-90" />
      {error}
    </div>
  );
};
export default AppError;