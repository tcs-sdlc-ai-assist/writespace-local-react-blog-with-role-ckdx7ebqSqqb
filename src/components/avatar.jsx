export function getAvatar(role) {
  const emoji = role === 'admin' ? '👑' : '📖';

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-lg select-none"
      title={role === 'admin' ? 'Admin' : 'Viewer'}
    >
      {emoji}
    </span>
  );
}