# Marka varlıkları

`innovex-logo-original.png` — innoveX ekibinden alınan orijinal logo dosyası
(11250×9000, geniş boşluklu export). Uygulamada kullanılan optimize edilmiş
sürüm `src/assets/innovex-logo.png` — bu klasördeki dosyadan kırpılıp
(şeffaf boşluklar temizlenerek) 800px genişliğe küçültüldü.

Logoyu yeniden işlemek gerekirse (farklı kırpma/boyut):

```bash
python3 - <<'PY'
from PIL import Image
im = Image.open('brand/innovex-logo-original.png')
bbox = im.getbbox()
trimmed = im.crop(bbox)
pad = int(trimmed.width * 0.02)
padded = Image.new('RGBA', (trimmed.width + pad*2, trimmed.height + pad*2), (0,0,0,0))
padded.paste(trimmed, (pad, pad), trimmed)
target_w = 800
scale = target_w / padded.width
resized = padded.resize((target_w, round(padded.height * scale)), Image.LANCZOS)
resized.save('src/assets/innovex-logo.png', optimize=True)
PY
```
