// Adobe Photoshop .GRD binary format parser and converter

/**
 * Parses Adobe Photoshop .GRD (Gradient) binary files into standard RGBA color stops.
 * Photoshop .GRD files use big-endian Pascal strings and 8BDC/8BIM (Photoshop Descriptor) format.
 */
export function parseGrdArrayBuffer(buffer) {
  const dataView = new DataView(buffer);
  const text = new TextDecoder('latin1').decode(buffer);
  const gradients = [];
  const nameEntries = [];

  // 1. Scan for all UTF-16BE gradient names preceded by 'Nm  TEXT'
  let pos = 0;
  while (pos < buffer.byteLength) {
    const nmIdx = text.indexOf('Nm  TEXT', pos);
    if (nmIdx === -1) break;
    
    try {
      const len = dataView.getUint32(nmIdx + 8, false);
      if (len > 0 && len < 200) {
        let str = '';
        for (let i = 0; i < (len - 1) * 2; i += 2) {
          str += String.fromCharCode(dataView.getUint16(nmIdx + 12 + i, false));
        }
        nameEntries.push({ name: str.trim(), offset: nmIdx });
      }
    } catch {
      // ignore parsing bounds
    }
    pos = nmIdx + 12;
  }

  // 2. Extract color stops for each identified gradient block
  for (let i = 0; i < nameEntries.length; i++) {
    const entry = nameEntries[i];
    const nextOffset = i < nameEntries.length - 1 ? nameEntries[i + 1].offset : buffer.byteLength;
    const str = text.substring(entry.offset, nextOffset);

    const clrsIdx = str.indexOf('ClrsVlLs');
    if (clrsIdx === -1) continue;

    const trnsIdx = str.indexOf('TrnsVlLs', clrsIdx);
    const clrsSlice = str.substring(clrsIdx, trnsIdx !== -1 ? trnsIdx : str.length);

    const stops = [];
    let clrPos = clrsSlice.indexOf('Clr ');
    while (clrPos !== -1) {
      const nextClr = clrsSlice.indexOf('Clr ', clrPos + 4);
      const subStr = clrsSlice.substring(clrPos, nextClr !== -1 ? nextClr : clrsSlice.length);

      const rdIdx = subStr.indexOf('Rd  doub');
      const grnIdx = subStr.indexOf('Grn doub');
      const blIdx = subStr.indexOf('Bl  doub');
      const lctnIdx = subStr.indexOf('Lctnlong');

      if (rdIdx !== -1 && grnIdx !== -1 && blIdx !== -1 && lctnIdx !== -1) {
        try {
          const absClrOffset = entry.offset + clrsIdx + clrPos;
          const r = Math.round(dataView.getFloat64(absClrOffset + rdIdx + 8, false));
          const g = Math.round(dataView.getFloat64(absClrOffset + grnIdx + 8, false));
          const b = Math.round(dataView.getFloat64(absClrOffset + blIdx + 8, false));
          const lctn = dataView.getInt32(absClrOffset + lctnIdx + 8, false);
          const position = Math.max(0, Math.min(100, Math.round((lctn / 4096) * 100)));

          const hex = '#' + [r, g, b].map(x => {
            const clamped = Math.max(0, Math.min(255, x));
            const h = clamped.toString(16);
            return h.length === 1 ? '0' + h : h;
          }).join('');

          stops.push({ color: hex, position, pantone: 'Photoshop TCX' });
        } catch {
          // skip
        }
      }
      clrPos = nextClr;
    }

    if (stops.length >= 2) {
      stops.sort((a, b) => a.position - b.position);
      gradients.push({
        id: `grd-imported-${gradients.length + 1}`,
        title: entry.name || `Imported Gradient ${gradients.length + 1}`,
        subtitle: `Imported from .GRD binary preset (${stops.length} color stops)`,
        type: 'linear',
        angle: 135,
        category: 'imported',
        badge: 'Photoshop .GRD',
        stops
      });
    }
  }

  return gradients;
}
