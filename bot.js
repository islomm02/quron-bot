
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');

const token = '7312724138:AAHN4sU23VVKucKbVZhKB41M3FoWoNwjiIo'; 
const bot = new Telegraf(token);

let isSurah = false;

const surahList = {
  "fotiha": 1, "baqara": 2, "ali imron": 3, "niso": 4, "moida": 5,
  "an'am": 6, "a'rof": 7, "anfal": 8, "tavba": 9, "yunus": 10,
  "hud": 11, "yusuf": 12, "ra'd": 13, "ibrohim": 14, "hijr": 15,
  "nahl": 16, "isro": 17, "kahf": 18, "maryam": 19, "toha": 20,
  "anbiyo": 21, "haj": 22, "mo'minun": 23, "nur": 24, "furqon": 25,
  "shuaro": 26, "naml": 27, "qasas": 28, "ankabut": 29, "rum": 30,
  "luqmon": 31, "sajda": 32, "ahzob": 33, "saba": 34, "fatir": 35,
  "ya sin": 36, "soffat": 37, "sad": 38, "zumar": 39, "g'ofir": 40,
  "fussilat": 41, "shuro": 42, "zuxruf": 43, "duxon": 44, "jasiyah": 45,
  "ahqof": 46, "muhammad": 47, "fath": 48, "hujurot": 49, "qof": 50,
  "zariyat": 51, "tur": 52, "najm": 53, "qamar": 54, "rahmon": 55,
  "vaqi'a": 56, "hadid": 57, "mujodala": 58, "hashr": 59, "mumtahina": 60,
  "saff": 61, "jumu'a": 62, "munofiqun": 63, "tag'obun": 64, "taloq": 65,
  "tahrim": 66, "mulk": 67, "qalam": 68, "haqqa": 69, "ma'arij": 70,
  "nuh": 71, "jinn": 72, "muzzammil": 73, "muddassir": 74, "qiyama": 75,
  "insan": 76, "mursalat": 77, "naba": 78, "nazi'at": 79, "abasa": 80,
  "takvir": 81, "infitor": 82, "mutoffifun": 83, "inshiqoq": 84, "buruj": 85,
  "toriq": 86, "a'la": 87, "g'oshiya": 88, "fajr": 89, "balad": 90,
  "shams": 91, "layl": 92, "duha": 93, "sharh": 94, "tiyn": 95,
  "alaq": 96, "qadr": 97, "bayyina": 98, "zilzila": 99, "adiyat": 100,
  "qori'a": 101, "takasur": 102, "asr": 103, "humaza": 104, "fil": 105,
  "quraysh": 106, "ma'un": 107, "kavsar": 108, "kofirun": 109, "nasr": 110,
  "masad": 111, "ixlos": 112, "falaq": 113, "nos": 114
};

async function surahGet(surah) {
    try {
        const response = await axios.get(`https://api.quran.com/api/v4/chapter_recitations/1/${surah}`);
        return response.data.audio_file.audio_url;
    } catch (error) {
        return null;
    }
}

async function ayahGet(ayah) {
    try {
        const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayah}/ar.alafasy`);
        return response.data.data.audio;
    } catch (error) {
        return null;
    }
}

bot.start((ctx) => {
    try {
      ctx.reply(
        "📖 *Xush kelibsiz!* Ushbu bot orqali Qur’on oyatlarini va suralarini eshitishingiz mumkin. 👇",
        Markup.keyboard([
            ["📖 Suralar", "📜 Oyatlar"]
        ])
        .oneTime(false)
        .resize()
    );
    } catch (error) {
      console.log(error.message);
      ctx.reply("Serverda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring");
      
    }
});

bot.hears("📖 Suralar", (ctx) => {
    try {
      ctx.reply("📖 Iltimos, kerakli sura raqamini yoki nomini yuboring (masalan: *2* yoki *Baqara*).");
    isSurah = true;
    } catch (error) {
      console.log(error.message);
      ctx.reply("Serverda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring");
      
    }
});

bot.hears("📜 Oyatlar", (ctx) => {
    try {
      ctx.reply("📜 Iltimos, kerakli oyat raqamini yuboring (1-6236).");
    isSurah = false;
    } catch (error) {
      console.log(error.message);
      ctx.reply("Serverda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring");
      
    }
});

bot.on('text', async (ctx) => {
    try {
      if (isSurah) {
        let surahNumber = parseInt(ctx.message.text);
        if (isNaN(surahNumber)) {
            let surahName = ctx.message.text.toLowerCase().trim();
            surahNumber = surahList[surahName] || null;
        }

        if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
            return ctx.reply("❌ Iltimos, 1 dan 114 gacha bo‘lgan sura raqamini yoki to‘g‘ri nomini kiriting!");
        }

        const audioUrl = await surahGet(surahNumber);

        if (audioUrl) {
            ctx.replyWithAudio(audioUrl, { caption: `📖 ${surahNumber}-sura tinglash:` });
        } else {
            ctx.reply("❌ Sura topilmadi yoki serverda xatolik yuz berdi.");
        }
    } else {
        const ayahNumber = parseInt(ctx.message.text);
        if (isNaN(ayahNumber) || ayahNumber < 1 || ayahNumber > 6236) {
            return ctx.reply("❌ Iltimos, 1 dan 6236 gacha bo‘lgan oyat raqamini kiriting!");
        }

        const audioUrl = await ayahGet(ayahNumber);

        if (audioUrl) {
            ctx.replyWithAudio(audioUrl, { caption: `📜 ${ayahNumber}-oyat tinglash:` });
        } else {
            ctx.reply("❌ Oyat topilmadi yoki serverda xatolik yuz berdi.");
        }
    }
    } catch (error) {
      console.log(error.message);
      ctx.reply("Serverda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring");
       
    }
});

bot.launch();
console.log("Bot ishga tushdi...");
