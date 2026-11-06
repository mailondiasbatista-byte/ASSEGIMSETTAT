import QRCode from 'qrcode';

export async function generateStudentQRCode(dataString: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(dataString, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function formatStudentIdDisplay(num: string): string {
  if (!num) return 'N/A';
  return num.toUpperCase();
}

export function formatDatePortuguese(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}
