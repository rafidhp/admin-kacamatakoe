import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormType } from "../types";

interface BasicInformationProps {
  data: FormType;
  setData: Dispatch<SetStateAction<FormType>>;
}

export default function BasicInformation({
  data,
  setData,
}: BasicInformationProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-medium mb-4">
        Informasi Dasar
      </h2>
      <div className="flex flex-col gap-2">
        <Label>
          Nama Kacamata
          <span className="text-red-500">*</span>
        </Label>
        <Input
          value={data.name}
          onChange={(e) => {
            setData(prev => ({
              ...prev,
              name: e.target.value,
            }));
          }}
          className="bg-white border-black/20 focus-visible:ring-black/5"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Deskripsi Kacamata</Label>
        <Textarea
          value={data.description ?? ''}
          onChange={(e) => {
            setData(prev => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          className="bg-white border-black/20 focus-visible:ring-black/5"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Kode Kacamata</Label>
        <Input
          value={data.glassesCode ?? ''}
          onChange={(e) => {
            setData(prev => ({
              ...prev,
              glassesCode: e.target.value,
            }));
          }}
          className="bg-white border-black/20 focus-visible:ring-black/5"
        />
      </div>
    </div>
  )
}