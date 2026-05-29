type RefreshProps = Readonly<{
  refetch: () => Promise<unknown>;
  disabled?: boolean;
}>

export default function Refresh({refetch, disabled = false}: RefreshProps) {
  return (
    <button
      onClick={() => refetch()}
      disabled={disabled}
      className="px-3 py-2 rounded bg-indigo-600 text-white"
    >
      Refresh
    </button>
  );
}