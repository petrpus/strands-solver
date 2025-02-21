import React from "react";

interface FieldProps {
  active: boolean;
  letter: string;
}

const Field = ({
  active,
  letter,
  ...props
}: FieldProps & React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={`w-12 h-12 flex justify-center items-center font-semibold text-xl p-2 rounded-full ${
        active ? "bg-slate-400  text-slate-950" : "bg-slate-700 text-white"
      }`}
    >
      {letter}
    </div>
  );
};

export default Field;
