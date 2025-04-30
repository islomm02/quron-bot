const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const token = "7312724138:AAH-HYwmdWeZ8bUZgFXtmx2VSmvDlQvyl4w";
const bot = new Telegraf(token);

let isSurah = false;

const surahList = {
  fotiha: 1,
  baqara: 2,
  "ali imron": 3,
  niso: 4,
  moida: 5,
  "an'am": 6,
  "a'rof": 7,
  anfal: 8,
  tavba: 9,
  yunus: 10,
  hud: 11,
  yusuf: 12,
  "ra'd": 13,
  ibrohim: 14,
  hijr: 15,
  nahl: 16,
  isro: 17,
  kahf: 18,
  maryam: 19,
  toha: 20,
  anbiyo: 21,
  haj: 22,
  "mo'minun": 23,
  nur: 24,
  furqon: 25,
  shuaro: 26,
  naml: 27,
  qasas: 28,
  ankabut: 29,
  rum: 30,
  luqmon: 31,
  sajda: 32,
  ahzob: 33,
  saba: 34,
  fatir: 35,
  "ya sin": 36,
  soffat: 37,
  sad: 38,
  zumar: 39,
  "g'ofir": 40,
  fussilat: 41,
  shuro: 42,
  zuxruf: 43,
  duxon: 44,
  jasiyah: 45,
  ahqof: 46,
  muhammad: 47,
  fath: 48,
  hujurot: 49,
  qof: 50,
  zariyat: 51,
  tur: 52,
  najm: 53,
  qamar: 54,
  rahmon: 55,
  "vaqi'a": 56,
  hadid: 57,
  mujodala: 58,
  hashr: 59,
  mumtahina: 60,
  saff: 61,
  "jumu'a": 62,
  munofiqun: 63,
  "tag'obun": 64,
  taloq: 65,
  tahrim: 66,
  mulk: 67,
  qalam: 68,
  haqqa: 69,
  "ma'arij": 70,
  nuh: 71,
  jinn: 72,
  muzzammil: 73,
  muddassir: 74,
  qiyama: 75,
  insan: 76,
  mursalat: 77,
  naba: 78,
  "nazi'at": 79,
  abasa: 80,
  takvir: 81,
  infitor: 82,
  mutoffifun: 83,
  inshiqoq: 84,
  buruj: 85,
  toriq: 86,
  "a'la": 87,
  "g'oshiya": 88,
  fajr: 89,
  balad: 90,
  shams: 91,
  layl: 92,
  duha: 93,
  sharh: 94,
  tiyn: 95,
  alaq: 96,
  qadr: 97,
  bayyina: 98,
  zilzila: 99,
  adiyat: 100,
  "qori'a": 101,
  takasur: 102,
  asr: 103,
  humaza: 104,
  fil: 105,
  quraysh: 106,
  "ma'un": 107,
  kavsar: 108,
  kofirun: 109,
  nasr: 110,
  masad: 111,
  ixlos: 112,
  falaq: 113,
  nos: 114,
};

async function surahGet(surah) {
  try {
    const response = await axios.get(
      `https://api.quran.com/api/v4/chapter_recitations/1/${surah}`
    );
    return response.data.audio_file.audio_url;
  } catch (error) {
    return null;
  }
}

async function ayahGet(ayah) {
  try {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${ayah}/ar.alafasy`
    );
    return response.data.data;
  } catch (error) {
    return null;
  }
}

async function namozVaqt() {
  try {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=Tashkent&country=Uzbekistan&method=2`
    );
    console.log(response.data.data.timings);
    return response.data.data.timings;
  } catch (error) {
    return "Xatolik yuz berdi. Iltimos keyinroq urining";
  }
}

bot.start((ctx) => {
  ctx.reply(
    `📖 *Xush kelibsiz, ${ctx.from.first_name}* Ushbu bot orqali Qur’on oyatlarini va suralarini eshitishingiz va Namoz vaqtlarini olishingiz mumkin. 👇`,
    Markup.keyboard([
      ["📖 Suralar", "📜 Oyatlar"],
      ["Namoz Vaqtlari⌛"],
    ]).resize()
  );
});

bot.hears("📖 Suralar", (ctx) => {
  ctx.reply(
    "📖 Iltimos, kerakli sura raqamini yoki nomini yuboring (masalan: *2* yoki *Baqara*)."
  );
  isSurah = true;
});

bot.hears("📜 Oyatlar", (ctx) => {
  ctx.reply("📜 Iltimos, kerakli oyat raqamini yuboring (1-6236).");
  isSurah = false;
});

bot.hears("Namoz Vaqtlari⌛", async (ctx) => {
    const data = await namozVaqt();
    const message = `
📍 *Toshkent shahri* uchun namoz vaqtlari:

🌅 Bomdod: ${data.Fajr}
🌞 Quyosh: ${data.Sunrise}
🕌 Peshin: ${data.Dhuhr}
🌤 Asr: ${data.Asr}
🌇 Shom: ${data.Maghrib}
🌙 Xufton: ${data.Isha}
  `;
    console.log(message);
    
  ctx.reply(message);
});

bot.on("text", async (ctx) => {
  try {
    if (isSurah) {
      let surahNumber = parseInt(ctx.message.text);
      let surahName = ctx.message.text.toLowerCase().trim();

      if (isNaN(surahNumber)) {
        surahNumber = surahList[surahName] || null;
      }

      if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
        return ctx.reply(
          "❌ Iltimos, 1 dan 114 gacha bo‘lgan sura raqamini yoki to‘g‘ri nomini kiriting!"
        );
      }

      let surahNameFromList = Object.keys(surahList).find(
        (key) => surahList[key] === surahNumber
      );
      surahNameFromList = surahNameFromList
        ? surahNameFromList.toUpperCase()
        : `Sura ${surahNumber}`;

      const audioUrl = await surahGet(surahNumber);

      if (audioUrl) {
        ctx.replyWithAudio(audioUrl, {
          caption: `📖 *${surahNameFromList}* tinglash:`,
        });
      } else {
        ctx.reply("❌ Sura topilmadi yoki serverda xatolik yuz berdi.");
      }
    } else {
      const ayahNumber = parseInt(ctx.message.text);
      if (isNaN(ayahNumber) || ayahNumber < 1 || ayahNumber > 6236) {
        return ctx.reply(
          "❌ Iltimos, 1 dan 6236 gacha bo‘lgan oyat raqamini kiriting!"
        );
      }

      const ayahData = await ayahGet(ayahNumber);

      if (ayahData) {
        const surahNumber = ayahData.surah.number;
        const surahName = ayahData.surah.englishName;
        const audioUrl = ayahData.audio;

        ctx.replyWithAudio(audioUrl, {
          caption: `📜 *${surahName}* surasidan ${ayahNumber}-oyat:`,
        });
      } else {
        ctx.reply("❌ Oyat topilmadi yoki serverda xatolik yuz berdi.");
      }
    }
  } catch (error) {
    console.log(error.message);
    ctx.reply(
      "Serverda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring."
    );
  }
});

bot.launch();
console.log("Bot ishga tushdi...");
