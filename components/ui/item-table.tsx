'use client';

import { useState } from 'react';
import { Button } from './button';
import { MoneyInput } from './money-input';
import { RequestItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface ItemTableProps {
  items: RequestItem[];
  onChange: (items: RequestItem[]) => void;
  disabled?: boolean;
  error?: string;
}

export function ItemTable({
  items,
  onChange,
  disabled = false,
  error,
}: ItemTableProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = () => {
    const newItem: RequestItem = {
      id: Math.random().toString(36).substr(2, 9),
      sku: '',
      desc: '',
      qty: 1,
      estUnitPrice: 0,
      lineTotal: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
    // Clear any errors for this item
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const updateItem = (
    id: string,
    field: keyof Omit<RequestItem, 'id' | 'lineTotal'>,
    value: string | number
  ) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate line total
        if (field === 'qty' || field === 'estUnitPrice') {
          updatedItem.lineTotal = updatedItem.qty * updatedItem.estUnitPrice;
        }

        return updatedItem;
      }
      return item;
    });
    onChange(updatedItems);
  };

  const validateItem = (item: RequestItem): string | null => {
    if (!item.sku.trim()) return 'SKU is required';
    if (!item.desc.trim()) return 'Description is required';
    if (item.qty <= 0) return 'Quantity must be greater than 0';
    if (item.estUnitPrice < 0) return 'Unit price cannot be negative';
    return null;
  };

  const handleItemBlur = (item: RequestItem) => {
    const error = validateItem(item);
    if (error) {
      setErrors(prev => ({ ...prev, [item.id]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[item.id];
        return newErrors;
      });
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No items added yet.</p>
          <p className="text-sm">Click "Add Item" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">SKU</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-2">Line Total</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-2">
                <input
                  type="text"
                  value={item.sku}
                  onChange={e =>
                    updateItem(item.id, 'sku', e.target.value.toUpperCase())
                  }
                  onBlur={() => handleItemBlur(item)}
                  disabled={disabled}
                  className="form-input text-sm"
                  placeholder="SKU"
                />
                {errors[item.id] && (
                  <p className="text-xs text-destructive mt-1">
                    {errors[item.id]}
                  </p>
                )}
              </div>

              <div className="col-span-4">
                <input
                  type="text"
                  value={item.desc}
                  onChange={e => updateItem(item.id, 'desc', e.target.value)}
                  onBlur={() => handleItemBlur(item)}
                  disabled={disabled}
                  className="form-input text-sm"
                  placeholder="Item description"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={e =>
                    updateItem(item.id, 'qty', parseInt(e.target.value) || 1)
                  }
                  onBlur={() => handleItemBlur(item)}
                  disabled={disabled}
                  className="form-input text-sm"
                />
              </div>

              <div className="col-span-2">
                <MoneyInput
                  value={item.estUnitPrice}
                  onChange={value => updateItem(item.id, 'estUnitPrice', value)}
                  onBlur={() => handleItemBlur(item)}
                  disabled={disabled}
                  className="text-sm"
                />
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm font-medium">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>

              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  disabled={disabled}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Total Estimate
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
