const EmptyState = ({ 
  title = 'No items found', 
  message = 'There are no items to display at the moment.',
  icon,
  action,
  actionLabel 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-4 max-w-md">{message}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

