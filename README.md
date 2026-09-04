# Görev — Innovex

`gorev.innovex.com` üzerinde yayınlanmak üzere hazırlanmış, basit bir müşteri
görev takip panosu. Tek bir sahibi (Innovex) vardır; her müşteri için ayrı,
tahmin edilemeyecek kadar rastgele bir link üretilir ve o linki elinde
bulunduran herkes ilgili panoyu **salt okunur** görebilir.

## Nasıl çalışır

- **`/login`** — tek parola ile giriş (kullanıcı adı/e-posta yok). Parola
  `OWNER_PASSWORD` ortam değişkeninde tutulur.
- **`/`** — giriş yapan sahibin panosu: müşteri panoları listesi, yeni pano
  oluşturma, her panonun gizli linkini kopyalama, pano silme.
- **`/panolar/[id]`** — bir panonun tam yönetimi (görev ekleme, durum
  değiştirme, silme). Girişli sahip dışında kimse erişemez.
- **`/b/[gizli-slug]`** — müşteriyle paylaşılan, kimlik doğrulaması
  gerektirmeyen salt okunur görünüm. Slug, müşteri adından türetilen okunabilir
  bir önek + rastgele 8 karakterlik bir sonekten oluşur (örn.
  `aph-innovex-x8Hg27KU`) — bu sonek olmadan pano bulunamaz, dolayısıyla
  linki bilmeyen biri panoya erişemez.
- Her sayfa `X-Robots-Tag: noindex, nofollow` header'ı ve `/robots.txt` ile
  arama motorlarına tamamen kapalıdır.

### Görevlerin kaynağı

Bir görev iki şekilde eklenebilir:

1. **Manuel** — sahip, `/panolar/[id]` üzerinden panelden ekler.
2. **Claude** — `API_KEY` ortam değişkeni tanımlıysa, o anahtarla
   `Authorization: Bearer <API_KEY>` header'ı kullanılarak
   `POST /api/boards/:boardId/tasks` çağrılabilir; bu yolla eklenen görevler
   otomatik olarak "Claude" kaynaklı işaretlenir. Bu, bir Claude
   oturumunun (örn. bu projeyi yöneten Claude Code oturumunun) panoya
   doğrudan görev ekleyebilmesini sağlar — owner parolasını bilmesine gerek
   kalmadan.

## Kurulum

```bash
npm install
cp .env.example .env   # DATABASE_URL, OWNER_PASSWORD, SESSION_SECRET doldurulmalı
npm run prisma:migrate
npm run dev             # http://localhost:3000
```

### Ortam değişkenleri

| Değişken         | Zorunlu | Açıklama                                                          |
| ---------------- | ------- | ------------------------------------------------------------------ |
| `DATABASE_URL`   | Evet    | PostgreSQL bağlantı adresi.                                        |
| `OWNER_PASSWORD` | Evet    | `/login` sayfasındaki tek parola.                                  |
| `SESSION_SECRET` | Evet    | Oturum çerezini imzalamak için rastgele metin (`openssl rand -hex 32`). |
| `API_KEY`        | Hayır   | Tanımlıysa, Claude/otomasyonun görev eklemesine izin verir.         |

## Vercel'e deploy

Bu proje tek bir Next.js uygulamasıdır (frontend + API route'ları + Prisma),
ayrı bir backend servisi gerekmez:

1. Vercel'de bu repodan yeni bir proje oluştur.
2. Project Settings → Environment Variables altında yukarıdaki değişkenleri
   gir (`DATABASE_URL` için Vercel Postgres/Neon/Supabase gibi herhangi bir
   yönetilen Postgres kullanılabilir).
3. İlk deploy'dan önce (veya bir kere elle) migration'ları uygula:
   `DATABASE_URL=... npx prisma migrate deploy`
4. Project Settings → Domains altında `gorev.innovex.com`'u ekle; Vercel
   sana ekleyeceğin bir CNAME/A kaydı gösterecek — bunu innovex.com'un DNS
   sağlayıcısında tanımla.

## Klasör yapısı

```
prisma/schema.prisma       Board + Task modelleri
src/lib/auth.ts             Tek parolalı oturum + API anahtarı doğrulama
src/lib/slug.ts              Gizli pano linki üretimi
src/lib/tasks.ts             Prisma <-> API veri dönüşümü
src/app/login/                Giriş sayfası
src/app/page.tsx               Sahip panosu (pano listesi)
src/app/panolar/[boardId]/      Bir panonun tam yönetimi
src/app/b/[slug]/                 Salt okunur, gizli link ile erişilen görünüm
src/app/api/                       Route handler'lar
src/components/                     Paylaşılan UI (TaskBoard, formlar, vb.)
```
