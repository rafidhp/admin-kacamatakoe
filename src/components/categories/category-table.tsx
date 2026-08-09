import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { Category } from "@/app/dashboard/categories/page";

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({
  categories,
}: CategoryTableProps) {
  return (
    <div className="flex items-center justify-center overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-black/40">
            <TableHead>No</TableHead>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Deskripsi Kategori</TableHead>
            <TableHead>Kacamata</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <span className="flex w-full justify-center">
                  Data kategori belum ada
                </span>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, i) => (
              <TableRow key={category.id}>
                <TableCell>{i}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.isGlasses ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}