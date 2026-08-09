# VERSA — Full Stack Portfolio

مشروع Next.js حقيقي (App Router + TypeScript) بدعم كامل للغتين **العربية** و**الإنجليزية**.

## طريقة التشغيل

```bash
npm install
npm run dev
```

افتح المتصفح على:
- http://localhost:3000/en — النسخة الإنجليزية (LTR)
- http://localhost:3000/ar — النسخة العربية (RTL)

الموقع بيوجّهك تلقائيًا لـ `/en` لو فتحت `/`.

## البنية

```
app/
  [locale]/
    layout.tsx     ← Layout خاص باللغة (خطوط، اتجاه RTL/LTR، Theme)
    page.tsx        ← صفحة Home
  layout.tsx        ← Root layout (stub)
  page.tsx           ← Redirect لـ /en
  globals.css        ← Design tokens (Dark/Light)
components/
  Navbar.tsx          ← بها زر تبديل اللغة EN/AR وزر Dark/Light
  Hero.tsx            ← Hero بالـ Typing Effect + Particles + Counters
  Marquee.tsx
  Skills.tsx
  Projects.tsx
  Testimonials.tsx
  Footer.tsx
  ThemeProvider.tsx    ← يدير الوضع الداكن/الفاتح عبر localStorage
  CustomCursor.tsx
  Loader.tsx
messages/
  en.json              ← كل نصوص الموقع بالإنجليزي
  ar.json              ← كل نصوص الموقع بالعربي
i18n.ts                ← إعداد next-intl
middleware.ts           ← توجيه الروابط حسب اللغة
```

## إضافة نصوص جديدة

كل نص في الموقع موجود في `messages/en.json` و `messages/ar.json` بنفس المفاتيح (keys). عايز تغيّر أي جملة؟ عدّلها في الملفين، مش في الكود.

## الخطوة الجاية

الصفحات التانية (About, Skills الكاملة, Projects بالفلترة, Services, Blog, Contact) ولوحة تحكم الأدمن (Dashboard + Backend + MongoDB) هتتبني بنفس الطريقة دي — مجلد لكل جزء ونصوص ثنائية اللغة.
