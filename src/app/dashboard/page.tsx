import { SectionCards } from "@/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
