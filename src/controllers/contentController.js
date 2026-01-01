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

exports.getMyContents = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Yetkisiz erişim" });
    }

    const { data, error } = await supabase
      .from("contents")
      .select(`
        *,
        content_tags (
          type,
          theme,
          time,
          age_limit,
          cast_count,
          male_cast_count,
          female_cast_count
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getMyContents error:", error);
      return res.status(500).json({ error: "İçerikler getirilemedi" });
    }

    return res.status(200).json({
      success: true,
      contents: data
    });

  } catch (err) {
    console.error("getMyContents catch:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};
exports.getSuggestionContents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contents")
      .select(`
        id,
        title,
        explanation,
        user_id,
        users (
          username
        )
      `);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "İçerikler alınamadı" });
    }

    // 🎲 Rastgele 3 içerik
    const shuffled = data.sort(() => 0.5 - Math.random());
    const randomThree = shuffled.slice(0, 3);

    return res.status(200).json({
      success: true,
      contents: randomThree
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.getAllContents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contents")
      .select(`
        *,
        users (
          username
        ),
        content_tags (
          type,
          theme,
          time,
          age_limit,
          cast_count,
          male_cast_count,
          female_cast_count
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "İçerikler alınamadı" });
    }

    return res.status(200).json({
      success: true,
      contents: data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const contentId = req.params.id;  
    const { data, error } = await supabase
      .from("contents")
      .select(`
        *,
        users (
          username
        ),
        content_tags (
          type,
          theme,
          time,
          age_limit,
          cast_count,
          male_cast_count,
          female_cast_count
        )
      `)
      .eq("id", contentId);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "İçerik alınamadı" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "İçerik bulunamadı" });
    }

    return res.status(200).json({
      success: true,
      content: data[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // auth middleware’den geliyor

    if (!id) {
      return res.status(400).json({ error: "İçerik ID gerekli" });
    }

    // 🔍 İçerik var mı & sahibi mi?
    const { data: content, error: findError } = await supabase
      .from("contents")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (findError || !content) {
      return res.status(404).json({ error: "İçerik bulunamadı" });
    }

    if (content.user_id !== userId) {
      return res.status(403).json({ error: "Bu içeriği silme yetkin yok" });
    }

    // 🗑 SİL
    const { error: deleteError } = await supabase
      .from("contents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(500).json({ error: "Silme başarısız" });
    }

    return res.status(200).json({
      success: true,
      message: "İçerik silindi"
    });

  } catch (err) {
    console.error("DELETE CONTENT ERROR:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("user_favorites")
      .select(`
        id,
        contents (
          id,
          title,
          explanation
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("GET FAVORITES ERROR:", error);
      return res.status(500).json({ error: "Favoriler alınamadı" });
    }

    const favorites = data.map(item => item.contents);

    res.status(200).json({
      success: true,
      favorites
    });

  } catch (err) {
    console.error("GET FAVORITES CATCH:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

/* =========================
   FAVORİYE EKLE
   POST /api/favorites/:contentId
========================= */
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;

    if (!contentId) {
      return res.status(400).json({ error: "contentId gerekli" });
    }

    // 🔍 Zaten var mı?
    const { data: exists } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("content_id", contentId)
      .single();

    if (exists) {
      return res.status(400).json({ error: "Zaten favorilerde" });
    }

    const { error } = await supabase
      .from("user_favorites")
      .insert({
        user_id: userId,
        content_id: contentId
      });

    if (error) {
      console.error("ADD FAVORITE ERROR:", error);
      return res.status(500).json({ error: "Favoriye eklenemedi" });
    }

    res.status(201).json({
      success: true,
      message: "Favorilere eklendi"
    });

  } catch (err) {
    console.error("ADD FAVORITE CATCH:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

/* =========================
   FAVORİDEN ÇIKAR
   DELETE /api/favorites/:contentId
========================= */
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;

    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", contentId);

    if (error) {
      console.error("REMOVE FAVORITE ERROR:", error);
      return res.status(500).json({ error: "Favoriden çıkarılamadı" });
    }

    res.status(200).json({
      success: true,
      message: "Favorilerden çıkarıldı"
    });

  } catch (err) {
    console.error("REMOVE FAVORITE CATCH:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
