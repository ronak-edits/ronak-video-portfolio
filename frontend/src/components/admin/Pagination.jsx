import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, total, onPageChange }) => {
  if (!totalPages || totalPages <= 1) {
    return total !== undefined ? (
      <p className="text-xs text-zinc-500">
        Showing {total} {total === 1 ? 'record' : 'records'}
      </p>
    ) : null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-800/80 pt-4 sm:flex-row">
      <p className="text-xs text-zinc-400">
        Page <span className="font-semibold text-white">{page}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>
        {total !== undefined && (
          <span className="ml-2 text-zinc-500">({total} total)</span>
        )}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#111111] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-[#e50914]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#111111] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-[#e50914]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
