"use client";
import { useState } from "react";
import Select from "react-select";

interface CheckboxItem {
   id: string;
   label: string;
}

export default function SideBarMerch() {
   const [isClearable, setIsClearable] = useState(true);

   const options = [
      { value: "pufa_computing", label: "PUFA Computing" },
      { value: "puma_informatics", label: "PUMA Informatics" },
      { value: "puma_is", label: "PUMA Information System" },
   ];

   const checkboxData: CheckboxItem[] = [
      { id: "all", label: "All" },
      { id: "jacket", label: "Jacket" },
      { id: "tshirt", label: "T-Shirt" },
      { id: "tumbler", label: "Tumbler" },
      { id: "totebag", label: "Totebag" },
   ];

   return (
      <div className="sticky hidden space-y-4 lg:block">
         <div className="rounded-xl bg-[#F2F2F2]">
            <div className="p-6">
               <p className="text-[16px] font-[700] text-[#353535]">Filter</p>
               <div className="space-y-2">
                  {checkboxData.map((item) => (
                     <label
                        key={item.id}
                        htmlFor={`Option${item.id}`}
                        className="flex cursor-pointer items-start gap-4"
                     >
                        <div className="flex items-center">
                           &#8203;
                           <input
                              type="checkbox"
                              className="size-4 rounded border-gray-300"
                              id={`Option${item.id}`}
                           />
                        </div>
                        <div>
                           <strong className="font-medium text-gray-900">
                              {item.label}
                           </strong>
                        </div>
                     </label>
                  ))}
                  <p className="text-[16px] font-[700] text-[#353535]">
                     Organizations
                  </p>
                  <Select isClearable={isClearable} options={options} />
               </div>
            </div>
         </div>
      </div>
   );
}
