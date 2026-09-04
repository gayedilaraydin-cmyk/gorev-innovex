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

`src/assets/innovex-logo-dark.png` — koyu tema sürümü. Orijinaldeki lacivert
"innove" metni koyu (neredeyse siyah) zeminde okunmuyordu; bu dosyada aynı
piksel geometrisi korunarak lacivert olmayan (kırmızı "X" hariç) pikseller
açık griye (`#F5F5F7`) çevrildi. `src/components/BrandMark.tsx` iki sürümü
de basar, `globals.css`'teki `.brand-logo-light`/`.brand-logo-dark`
kuralları hangisinin görüneceğini (sistem tercihi + olası bir data-theme
override'ı) belirler. Işık sürümü değişirse bu dosyayı da yeniden üretmek
gerekir:

```bash
python3 - <<'PY'
from PIL import Image
im = Image.open('src/assets/innovex-logo.png').convert('RGBA')
pixels = im.load()
w, h = im.size
LIGHT = (245, 245, 247)
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        is_reddish = r > g + 20 and r > b + 20
        if not is_reddish:
            pixels[x, y] = (*LIGHT, a)
im.save('src/assets/innovex-logo-dark.png', optimize=True)
PY
```
