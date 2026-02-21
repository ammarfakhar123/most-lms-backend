const multer = require('multer');
const supabase = require('../config/supabase');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, true)
});

const uploadToSupabase = async (file, folder = 'lms-submissions') => {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  
  const { data, error } = await supabase.storage
    .from('lms-files')
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('lms-files')
    .getPublicUrl(fileName);

  return { url: publicUrl, fileName };
};

module.exports = { upload, uploadToSupabase };