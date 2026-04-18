interface PaginationProps { currentPage: number; totalPages: number; onPageChange: (p: number) => void; }

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) range.push(i);
    if (currentPage - delta > 2) range.unshift('...');
    if (currentPage + delta < totalPages - 1) range.push('...');
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const base = { minWidth: 40, height: 40, padding: '0 0.5rem', borderWidth: 1, borderStyle: 'solid', borderColor: '#e0e0e0', backgroundColor: '#fff', borderRadius: 12, fontFamily: '"Montserrat", sans-serif', fontSize: 14, fontWeight: 500, color: '#1a1a1a', cursor: 'pointer', transition: 'all 0.2s' } as const;
  const active = { ...base, backgroundColor: '#d4af37', borderColor: '#d4af37', color: '#fff' };
  const disabled = { ...base, opacity: 0.4, cursor: 'not-allowed' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
      <button style={currentPage === 1 ? disabled : base} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
      {getPageNumbers().map((p, i) => typeof p === 'number' ? <button key={i} style={currentPage === p ? active : base} onClick={() => onPageChange(p)}>{p}</button> : <span key={i} style={{ padding: '0 4px', color: '#666' }}>...</span>)}
      <button style={currentPage === totalPages ? disabled : base} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
    </div>
  );
}