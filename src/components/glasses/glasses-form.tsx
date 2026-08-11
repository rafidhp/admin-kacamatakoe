"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/app/dashboard/categories/page";
import BasicInformation from "./form/basic-info";
import type { FormType } from "./types";
import MultiStepForm from "../multi-step-form";

interface GlassesFormProps {
  categories: Category[];
}

const steps = [
  {
    id: "basic-info",
    title: "Informasi Dasar",
    number: 1,
  },
  {
    id: "blog-data",
    title: "Blog Data",
    number: 2,
  },
  {
    id: "galllery",
    title: "Gallery",
    number: 3,
  },
];

export default function GlassesForm({
  categories,
}: GlassesFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const isFirstStep = currentStep === 1;
  const [isLoading, setIsLoading] = useState(false);
  const isLastStep = currentStep === steps.length;

  const [data, setData] = useState<FormType>({
    id: '',
    categoryId: null,
    promoId: null,
    name: '',
    description: null,
    productType: 'glasses',
    glassesCode: null,

    advantages: [],
  });

  const handleClose = () => {
    router.back();
  }

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      return;
    }

    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // submit data ke server
      console.log("Submit glasses");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformation
            data={data}
            setData={setData}
            categories={categories}
          />
        );

      case 2:
        return <div>Product Data</div>;

      case 3:
        return <div>Gallery</div>;

      default: return null;
    }
  };

  return (
    <MultiStepForm
      title='Tambah Kacamata Baru'
      steps={steps}
      currentStep={currentStep}
      onClose={handleClose}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canGoPrevious={!isFirstStep}
      nextButtonText={
        isLastStep ? "Simpan Kacamata" : "Berikutnya"
      }
      isLoading={isLoading}
    >
      {renderStep()}
    </MultiStepForm>
  )
}