import Image from 'next/image';
import innovexLogoLight from '@/assets/innovex-logo.png';
import innovexLogoDark from '@/assets/innovex-logo-dark.png';

// innoveX'in gerçek logo dosyası (marka ekibinden alınan orijinal PNG,
// brand/innovex-logo-original.png içinden kırpılıp optimize edildi —
// bkz. o klasördeki not). Metinden yeniden çizilmiş bir yaklaşıklık değil.
//
// Orijinal logodaki "innove" lacivert metni koyu temada neredeyse-siyah
// zeminde okunmaz hale geliyordu; bu yüzden aynı dosyadan üretilmiş, metni
// açık renge çevrilmiş bir koyu tema sürümü de var (bkz. brand/README.md).
// İkisi de basılır, hangisinin görüneceğini globals.css'teki
// .brand-logo-light/.brand-logo-dark kuralları (tema token'larıyla aynı
// mantık: sistem tercihi + olası bir data-theme override'ı) belirler.
export function BrandMark({ className = '', height = 22 }: { className?: string; height?: number }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={innovexLogoLight}
        alt="innoveX"
        height={height}
        style={{ height, width: 'auto' }}
        className="brand-logo-light"
        priority
      />
      <Image
        src={innovexLogoDark}
        alt="innoveX"
        height={height}
        style={{ height, width: 'auto' }}
        className="brand-logo-dark"
        priority
      />
    </span>
  );
}
