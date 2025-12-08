import DashboardView from "@/app/(components)/dashboard/DashboardView";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) {
  return <DashboardView searchParams={searchParams} />;
}