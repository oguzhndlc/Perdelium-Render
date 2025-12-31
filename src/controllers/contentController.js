const supabase = require("../lib/supabase");

exports.createContent = async (req, res) => {
  try {

    // 🔐 AUTH KONTROLÜ
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Yetkisiz erişim" });
    }

    const {
      title,
      explanation,
      html_content,
      type,
      theme,
      time,
      age_limit,
      cast_count,
      male_cast_count,
      female_cast_count
    } = req.body;

    if (!title || !html_content) {
      return res.status(400).json({ error: "Zorunlu alanlar eksik" });
    }

    // 1️⃣ CONTENT
    const { data: content, error: contentError } = await supabase
      .from("contents")
      .insert([{
        user_id: req.user.id, // ✅ artık güvenli
        title,
        explanation,
        html_content
      }])
      .select()
      .single();

    if (contentError) {
      console.error(contentError);
      return res.status(500).json({ error: "Content oluşturulamadı" });
    }

    // 2️⃣ TAGS
    const { data: tags, error: tagsError } = await supabase
      .from("content_tags")
      .insert([{
        content_id: content.id,
        type,
        theme,
        time,
        age_limit,
        cast_count,
        male_cast_count,
        female_cast_count
      }])
      .select()
      .single();

    // ❗ Rollback
    if (tagsError) {
      await supabase
        .from("contents")
        .delete()
        .eq("id", content.id);

      console.error(tagsError);
      return res.status(500).json({ error: "Etiketler eklenemedi" });
    }

    return res.status(201).json({
      success: true,
      content,
      content_tags: tags
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};
