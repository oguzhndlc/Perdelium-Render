const supabase = require("../lib/supabase");

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

    const { data: exists } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("content_id", contentId)
      .maybeSingle();

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
      return res.status(500).json({ error: "Favoriye eklenemedi" });
    }

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
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

exports.isFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;

    if (!contentId) {
      return res.status(400).json({ error: "contentId gerekli" });
    }

    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("content_id", contentId)
      .maybeSingle(); // 🔑 önemli

    if (error) {
      console.error("IS FAVORITE ERROR:", error);
      return res.status(500).json({ error: "Favori kontrol edilemedi" });
    }

    res.json({
      isFavorite: !!data // varsa true, yoksa false
    });

  } catch (err) {
    console.error("IS FAVORITE CATCH:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
