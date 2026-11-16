# 🎬 KinoQidiruv

Kinolarni qidirish, sevimlilarga qo'shish va tavsifini ko'rish uchun React ilovasi.

## Imkoniyatlar
- Kino nomi bo'yicha qidiruv, o'zbekcha va inglizcha nomlar bilan (yozishdan to'xtagandan keyin avtomatik)
- Mashhur kinolar ro'yxati va "Yana yuklash" tugmasi
- Kino haqida batafsil oyna (reyting, sana, tavsif) va YouTube treyleri
- Sevimli kinolar (brauzer xotirasida saqlanadi)
- Yuklanish, xato va bo'sh natija holatlari
- Telefon va kompyuter uchun moslashuvchan dizayn

## Texnologiyalar
React, Vite, Tailwind CSS, JavaScript, [TMDB API](https://www.themoviedb.org/)

## Ishga tushirish
1. `npm install`
2. TMDB'da bepul API kalit oling: https://www.themoviedb.org/settings/api
3. `.env.example` faylini `.env.local` nomi bilan nusxalang va kalitni yozing
4. `npm run dev`

## Deploy (Vercel)
Vercel'da loyiha sozlamalari (Environment Variables) ga `VITE_TMDB_KEY` ni qo'shing.

Bu mahsulot TMDB API'dan foydalanadi, lekin TMDB tomonidan tasdiqlanmagan.
