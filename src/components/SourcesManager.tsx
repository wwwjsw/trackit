import { useState } from 'react';
import type { Source } from '../types';
import { Trash2, Plus, Github } from 'lucide-react';

interface SourcesManagerProps {
  sources: Source[];
  onAdd: (owner: string, repo: string) => Promise<void>;
  onRemove: (id: string) => void;
}

export function SourcesManager({ sources, onAdd, onRemove }: SourcesManagerProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.includes('/')) {
      alert('Please use format: owner/repo');
      return;
    }
    const [owner, repo] = input.split('/');
    setLoading(true);
    await onAdd(owner, repo);
    setLoading(false);
    setInput('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Github /> Add Source
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="facebook/react"
            style={{ 
              flex: 1, 
              padding: '0.6rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-color)'
            }}
          />
          <button type="submit" className="btn" disabled={loading} style={{ background: 'var(--primary-color)', color: '#000', border: 'none' }}>
            {loading ? '...' : <Plus size={20} />}
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Your Stack ({sources.length})</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {sources.map(source => (
          <div key={source.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontWeight: 500 }}>{source.owner} / <span style={{ color: 'var(--primary-color)' }}>{source.repo}</span></span>
            <button onClick={() => onRemove(source.id)} className="btn" style={{ padding: '0.4rem', color: '#f78166', background: 'transparent' }}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
