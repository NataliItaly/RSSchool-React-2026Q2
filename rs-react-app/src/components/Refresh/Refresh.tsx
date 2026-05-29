type RefreshProps = Readonly<{
  refetch: () => Promise<unknown>;
  disabled?: boolean;
}>

export default function Refresh({refetch, disabled = false}: RefreshProps) {
  return (
    <button
      onClick={() => refetch()}
      disabled={disabled}
      className="py-2 px-8 rounded-md bg-green-800 text-white hover:bg-green-600 cursor-pointer transition-all duration-600"
    >
      Refresh
    </button>
  );
}