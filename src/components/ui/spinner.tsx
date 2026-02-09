import { Loader } from "lucide-react";

const Spinner = () => {
  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Spinner;
