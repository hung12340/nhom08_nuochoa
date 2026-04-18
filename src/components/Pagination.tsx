interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift('...');
    if (currentPage + delta < totalPages - 1) range.push('...');
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const baseBtnStyle: React.CSSProperties = {
    minWidth: '2.5rem',
    height: '2.5rem',
    padding: '0 0.5rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    fontFamily: '"Montserrat", sans-serif',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#1a1a1a',
    cursor: 'pointer',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    transition: 'all 0.2s',
  };

  const activeStyle: React.CSSProperties = {
    ...baseBtnStyle,
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
    color: '#fff',
  };

  const disabledStyle: React.CSSProperties = {
    ...baseBtnStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
      <button
        style={currentPage === 1 ? disabledStyle : baseBtnStyle}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </button>

      {getPageNumbers().map((page, idx) =>
        typeof page === 'number' ? (
          <button
            key={idx}
            style={currentPage === page ? activeStyle : baseBtnStyle}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={idx} style={{ padding: '0 0.25rem', color: '#666', fontFamily: '"Montserrat", sans-serif' }}>
            ...
          </span>
        )
      )}

      <button
        style={currentPage === totalPages ? disabledStyle : baseBtnStyle}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>
    </div>
  );
}