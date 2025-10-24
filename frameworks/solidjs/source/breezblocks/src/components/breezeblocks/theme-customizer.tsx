'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function hexToHsl(hex: string): string {
  if (!hex) return '';
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

function ColorControl({
  label,
  id,
  color,
  setColor,
}: {
  label: string;
  id: string;
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="capitalize">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono uppercase text-muted-foreground">{color}</span>
        <Input
          id={id}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-8 cursor-pointer p-1"
        />
      </div>
    </div>
  );
}

export function ThemeCustomizer() {
  const [primary, setPrimary] = useState('#4f46e5');
  const [accent, setAccent] = useState('#a855f7');
  const [background, setBackground] = useState('#f9fafb');

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', hexToHsl(primary));
    document.documentElement.style.setProperty('--ring', hexToHsl(primary));
  }, [primary]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', hexToHsl(accent));
  }, [accent]);

  useEffect(() => {
    const backgroundHsl = hexToHsl(background);
    document.documentElement.style.setProperty('--background', backgroundHsl);
    document.documentElement.style.setProperty('--card', backgroundHsl);
    document.documentElement.style.setProperty('--popover', backgroundHsl);
  }, [background]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Customize your theme colors in real-time. Changes are applied instantly.
      </p>
      <div className="space-y-4 rounded-md border p-4">
        <ColorControl label="Primary" id="primary-color" color={primary} setColor={setPrimary} />
        <ColorControl label="Accent" id="accent-color" color={accent} setColor={setAccent} />
        <ColorControl label="Background" id="background-color" color={background} setColor={setBackground} />
      </div>
    </div>
  );
}
