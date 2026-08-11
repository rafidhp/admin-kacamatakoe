import { Plus, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Category } from "@/app/dashboard/categories/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SingleCombobox from "@/components/single-combobox";
import type { FormType } from "../types";

interface BasicInformationProps {
  data: FormType;
  setData: Dispatch<SetStateAction<FormType>>;
  categories: Category[];
}

export default function BasicInformation({
  data,
  setData,
  categories,
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
          placeholder="Nama Kacamata"
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
          placeholder="Bahan titanium, cocok dipake kondangan..."
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
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
            placeholder="ABC123"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label>
            Kategori
            <span className="text-red-500">*</span>
          </Label>
          <SingleCombobox
            data={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            value={data.categoryId}
            onChange={(value) => {
              setData((prev) => ({
                ...prev,
                categoryId: value,
              }));
            }}
            placeholder="Pilih kategori"
            searchPlaceholder="Cari kategori..."
            emptyMessage="Kategori tidak ditemukan."
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between w-full">
          <Label>
            Kelebihan/Keunggulan Produk
            {data.advantages.length > 0 && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Button
            type="button"
            onClick={() => {
              setData((prev) => ({
                ...prev,
                advantages: [...prev.advantages, ""],
              }));
            }}
            className="
              flex items-center gap-1.5
              bg-transparent hover:bg-black
              text-black hover:text-white
              rounded-md transition
              border border-black/30
              cursor-pointer
            "
          >
            <Plus />
            Tambah Keunggulan
          </Button>
        </div>
        {data.advantages.length === 0 ? (
          <div className="flex items-center justify-start">
            <span className="text-muted-foreground">Belum ada keunggulan</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.advantages.map((advantage, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <Input
                  required={data.advantages.length > 0}
                  value={advantage}
                  placeholder={`Keunggulan ${index + 1}`}
                  onChange={(event) => {
                    const value = event.target.value;

                    setData((prev) => ({
                      ...prev,
                      advantages: prev.advantages.map(
                        (item, itemIndex) =>
                          itemIndex === index ? value : item,
                      ),
                    }));
                  }}
                  className="bg-white border-black/20 focus-visible:ring-black/5"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      advantages: prev.advantages.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    }));
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}