import React from "react";
import { notFound } from "next/navigation";
import { mockBoxCategories } from "@/constant/box-data";
import BoxDetail from "@/components/box-page/box-detail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BoxDetailPageProps {
  params: Promise<{
    boxId: string;
  }>;
}

const BoxDetailPage = async ({ params }: BoxDetailPageProps) => {
  const { boxId } = await params;
  
  // Find the box from all categories
  const box = mockBoxCategories
    .flatMap(category => category.boxes)
    .find(box => box.id === boxId);

  if (!box) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <section className="relative py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/box">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-pricedown text-white">
                {box.title.replace('\n', ' ')}
              </h1>
              <p className="text-white/60 font-suisse">
                Mystery Box #{box.location} - ${box.price}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Box Detail Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <BoxDetail box={box} />
        </div>
      </section>
    </main>
  );
};

export default BoxDetailPage;

