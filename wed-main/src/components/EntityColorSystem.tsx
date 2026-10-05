import React, { type CSSProperties } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * Shared colour system for roles, titles, units, categories, tags and statuses.
 * It stays lightweight: colour metadata lives with the existing CMS document,
 * so rendering a badge never triggers a separate D1/Firestore query.
 */
export const ENTITY_COLOR_PRESETS = [
  '#0284C7', '#2563EB', '#1D4ED8', '#4F46E5', '#7C3AED', '#9333EA',
  '#C026D3', '#DB2777', '#E11D48', '#DC2626', '#EA580C', '#D97706',
  '#CA8A04', '#65A30D', '#16A34A', '#059669', '#0D9488', '#0891B2',
  '#475569', '#334155', '#0F766E', '#0369A1', '#6D28D9', '#BE123C',
] as const;

const FALLBACK_COLOR = '#0284C7';

const normalizeHex = (value?: string | null): string | null => {
  if (!value) return null;
  const raw = value.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(raw);
  if (short) {
    const [r, g, b] = short[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toUpperCase();
  return null;
};

export const sanitizeEntityColor = (value?: string | null): string | undefined =>
  normalizeHex(value) || undefined;

const normalizeLabel = (input?: string | null): string =>
  String(input || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('vi-VN');

const hashString = (input: string): number => {
  // FNV-1a 32-bit: deterministic and stable across refreshes/devices.
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

export const getDeterministicEntityColor = (label?: string | null): string => {
  const normalized = normalizeLabel(label);
  if (!normalized) return FALLBACK_COLOR;
  return ENTITY_COLOR_PRESETS[hashString(normalized) % ENTITY_COLOR_PRESETS.length];
};

export const resolveEntityColor = (label?: string | null, override?: string | null): string =>
  normalizeHex(override) || getDeterministicEntityColor(label);

export const getSemanticStatusColor = (status?: string | null): string => {
  const key = normalizeLabel(status);
  const semantic: Record<string, string> = {
    open: '#059669',
    active: '#059669',
    published: '#2563EB',
    approved: '#059669',
    completed: '#0D9488',
    upcoming: '#D97706',
    reviewing: '#2563EB',
    needs_info: '#D97706',
    draft: '#64748B',
    closed: '#64748B',
    inactive: '#64748B',
    rejected: '#DC2626',
    revoked: '#DC2626',
  };
  return semantic[key] || getDeterministicEntityColor(key || 'status');
};

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = normalizeHex(hex) || FALLBACK_COLOR;
  return [
    Number.parseInt(clean.slice(1, 3), 16),
    Number.parseInt(clean.slice(3, 5), 16),
    Number.parseInt(clean.slice(5, 7), 16),
  ];
};

const rgbToHex = ([r, g, b]: [number, number, number]): string =>
  `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();

const mix = (a: string, b: string, weightOfB: number): string => {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const w = Math.max(0, Math.min(1, weightOfB));
  return rgbToHex([
    ar * (1 - w) + br * w,
    ag * (1 - w) + bg * w,
    ab * (1 - w) + bb * w,
  ]);
};

const channelLuminance = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
};

const contrast = (a: string, b: string): number => {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
};

const readableTextOnTint = (base: string, background: string): string => {
  for (let amount = 0.12; amount <= 0.88; amount += 0.08) {
    const candidate = mix(base, '#000000', amount);
    if (contrast(candidate, background) >= 4.5) return candidate;
  }
  return '#111827';
};

export interface EntityBadgePalette {
  base: string;
  background: string;
  border: string;
  text: string;
  solidText: '#FFFFFF' | '#111827';
}

export const getEntityBadgePalette = (
  label?: string | null,
  override?: string | null,
): EntityBadgePalette => {
  const base = resolveEntityColor(label, override);
  const background = mix(base, '#FFFFFF', 0.88);
  const border = mix(base, '#FFFFFF', 0.62);
  const text = readableTextOnTint(base, background);
  const solidText = contrast(base, '#FFFFFF') >= contrast(base, '#111827') ? '#FFFFFF' : '#111827';
  return { base, background, border, text, solidText };
};

export const getEntityBadgeStyle = (
  label?: string | null,
  override?: string | null,
): CSSProperties => {
  const palette = getEntityBadgePalette(label, override);
  return {
    backgroundColor: palette.background,
    borderColor: palette.border,
    color: palette.text,
  };
};

interface EntityBadgeProps {
  label: string;
  color?: string | null;
  className?: string;
  solid?: boolean;
  title?: string;
}

export const EntityBadge: React.FC<EntityBadgeProps> = ({
  label,
  color,
  className = '',
  solid = false,
  title,
}) => {
  const palette = getEntityBadgePalette(label, color);
  return (
    <span
      title={title || label}
      className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-[11px] font-black leading-5 ${className}`}
      style={
        solid
          ? { backgroundColor: palette.base, borderColor: palette.base, color: palette.solidText }
          : { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }
      }
    >
      <span className="whitespace-normal break-words">{label}</span>
    </span>
  );
};

interface EntityColorPickerProps {
  label?: string;
  entityLabel: string;
  value?: string | null;
  onChange: (value: string | undefined) => void;
  helperText?: string;
  fallbackColor?: string;
}

export const EntityColorPicker: React.FC<EntityColorPickerProps> = ({
  label = 'Màu nhận diện',
  entityLabel,
  value,
  onChange,
  helperText = 'Để Tự động nếu muốn hệ thống gán màu ổn định theo tên. Cùng một nhãn luôn nhận cùng màu.',
  fallbackColor,
}) => {
  const custom = sanitizeEntityColor(value);
  const fallback = sanitizeEntityColor(fallbackColor);
  const resolved = custom || fallback || resolveEntityColor(entityLabel);

  return (
    <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wide text-slate-600">{label}</div>
          <div className="mt-1 text-[10px] leading-4 text-slate-500">{helperText}</div>
        </div>
        <EntityBadge label={entityLabel || 'Chưa đặt tên'} color={custom || fallback} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative h-9 w-11 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm" title="Chọn màu tùy chỉnh">
          <input
            type="color"
            aria-label={`Chọn ${label.toLowerCase()}`}
            value={resolved}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="absolute -inset-1 h-12 w-14 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>

        {ENTITY_COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-label={`Dùng màu ${color}`}
            title={color}
            className={`h-7 w-7 rounded-full border-2 shadow-sm transition hover:scale-110 ${
              custom === color ? 'border-slate-900 ring-2 ring-slate-300' : 'border-white'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}

        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
          title="Bỏ màu tùy chỉnh và dùng màu tự động ổn định"
        >
          <RotateCcw size={12} /> Tự động
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <code className="rounded bg-white px-1.5 py-0.5 font-mono text-slate-700">{custom || `AUTO → ${resolved}`}</code>
        <span>•</span>
        <span>không tạo truy vấn riêng cho màu</span>
      </div>
    </div>
  );
};
