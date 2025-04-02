import axios from 'axios';
async function surahGet(surah) {
  try {
    const response = await axios.get(`https://api.quran.com/api/v4/chapter_recitations/2/${surah}`);
    return response.data.audio_file.audio_url;
  } catch (error) {
    return null;
  }
}

surahGet(109).then(audioUrl => console.log(audioUrl)).catch(error => console.error(error));