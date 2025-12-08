import DashboardView from "@/app/(components)/dashboard/DashboardView";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    month?: string;
  }>;
}) {
  return <DashboardView searchParams={searchParams} />;
}