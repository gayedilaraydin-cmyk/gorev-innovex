import Image from 'next/image';
import innovexLogo from '@/assets/innovex-logo.png';

// innoveX'in gerçek logo dosyası (marka ekibinden alınan orijinal PNG,
// brand/innovex-logo-original.png içinden kırpılıp optimize edildi —
// bkz. o klasördeki not). Metinden yeniden çizilmiş bir yaklaşıklık değil.
export function BrandMark({ className = '', height = 22 }: { className?: string; height?: number }) {
  return (
    <Image
      src={innovexLogo}
      alt="innoveX"
      height={height}
      style={{ height, width: 'auto' }}
      className={className}
      priority
    />
  );
}
