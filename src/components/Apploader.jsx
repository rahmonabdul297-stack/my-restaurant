import { ClipLoader  } from "react-spinners";

export const Apploader = () => {
  return (
      <div className="w-full text-AppBlack flex justify-center items-center text-center">
    <ClipLoader 
      aria-label="loading spinner"
      data-testid="loader"
    />
    </div>
  );
};
