import type { SelectedItem } from "../../store/selectedItemsSlice";

interface ToolbarProps {
  selectedItems: SelectedItem[];
  clearSelectedItems: () => void;
  handleDownload: () => void;
}

export default function Toolbar({ selectedItems, clearSelectedItems, handleDownload }: ToolbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full flex flex-col items-center gap-2 text-base p-4 bg-amber-100 dark:bg-gray-700 dark:text-white">
      <p>{`${selectedItems.length} items selected`}</p>
      <p>
        <button
          className="bg-pink-700 text-white rounded-md cursor-pointer text-base mx-4 px-4 py-2"
          onClick={clearSelectedItems}
        >
          Unselect All
        </button>
        <button className="bg-purple-700 text-white rounded-md cursor-pointer text-base mx-4 px-4 py-2" onClick={handleDownload}>
          Download All
        </button>
      </p>
    </div>
  );
}