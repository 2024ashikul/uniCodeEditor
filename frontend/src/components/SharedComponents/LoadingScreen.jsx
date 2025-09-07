export default function LoadingFullscreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-lg font-semibold text-blue-600">Loading...</p>
    </div>
  );
}
