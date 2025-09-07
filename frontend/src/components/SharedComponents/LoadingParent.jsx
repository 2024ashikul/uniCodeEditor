export default function LoadingParent() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 h-full w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-lg font-medium">Loading...</p>
    </div>
  );
}
