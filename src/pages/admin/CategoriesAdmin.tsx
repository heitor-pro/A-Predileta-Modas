import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { listCategories, createCategory, updateCategory, deleteCategory } from '@/services/categories.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Category } from '@/types/product';

export function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const load = () => listCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createCategory(newName.trim());
    setNewName('');
    load();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = async (id: string) => {
    await updateCategory(id, editingName.trim());
    setEditingId(null);
    load();
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Excluir a categoria "${cat.name}"? Produtos vinculados a ela ficarão sem categoria.`)) return;
    await deleteCategory(cat.id);
    load();
  };

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-3xl italic">Categorias</h1>

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nova categoria" />
        <Button type="submit"><Plus size={16} /></Button>
      </form>

      <ul className="divide-y divide-silver-200 dark:divide-silver-800 rounded-xl border border-silver-200 dark:border-silver-800">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between px-4 py-3">
            {editingId === cat.id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full bg-transparent text-sm outline-none border-b border-silver-400"
                autoFocus
              />
            ) : (
              <span className="text-sm">{cat.name}</span>
            )}
            <div className="flex gap-3">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => saveEdit(cat.id)} className="text-xs text-silver-600">Salvar</button>
                  <button onClick={() => setEditingId(null)} aria-label="Cancelar"><X size={14} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(cat)} aria-label="Editar categoria"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(cat)} aria-label="Excluir categoria" className="text-silver-500 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
