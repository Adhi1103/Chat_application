

export const MessageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 p-4 w-full max-w-md mx-auto">
      {/* Skeleton for the avatar and username */}

      
      {/* Skeleton for the message box */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-5/6 h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Skeleton for the timestamp */}
      <div className="w-1/4 h-3 bg-gray-300 rounded animate-pulse self-end"></div>
    </div>
  );
};
