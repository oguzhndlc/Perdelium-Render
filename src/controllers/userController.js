const bcrypt = require("bcryptjs");
const supabase = require("../lib/supabase");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, username, password, name, surname } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Zorunlu alanlar eksik" });
    }

    // 🔐 bcrypt hash
    const password_hash = await bcrypt.hash(password, 10);

    // 1️⃣ USER OLUŞTUR
    const { data: usersData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email,
          username,
          password_hash,
          name,
          surname,
        },
      ])
      .select()
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    // 2️⃣ PROFILE OLUŞTUR (SADECE ID + USER_ID)
const { data: profileData, error: profileError } = await supabase
  .from("user_profiles")
  .insert([
    {
      id: usersData.id,
      user_id: usersData.id,
    },
  ])
  .select()
  .single();

console.log("PROFILE DATA:", profileData);
console.log("PROFILE ERROR:", profileError);

    if (profileError) {
      return res.status(500).json({
        error: "Profil oluşturulamadı",
        details: profileError.message,
      });
    }

    return res.status(201).json({
      success: true,
      user: usersData,
      profile: profileData,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: "Kullanıcı adı/email ve şifre zorunlu",
      });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        email,
        username,
        name,
        surname,
        password_hash,
        user_profiles (*)
      `)
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .limit(1);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Hatalı giriş" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Hatalı giriş" });
    }

    delete user.password_hash;

    // 🔐 JWT OLUŞTUR
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      user_id,      // zorunlu
      phone,
      avatar_url,
      about,
      insta_link,
      web_link,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: "user_id zorunludur",
      });
    }

    // 🔄 Güncellenecek alanları dinamik oluştur
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (about !== undefined) updateData.about = about;
    if (insta_link !== undefined) updateData.insta_link = insta_link;
    if (web_link !== undefined) updateData.web_link = web_link;

    updateData.updated_at = new Date();

    // 🚫 Güncellenecek alan yoksa
    if (Object.keys(updateData).length === 1) {
      return res.status(400).json({
        error: "Güncellenecek veri yok",
      });
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updateData)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: "Profil güncellenemedi",
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      profile: data,
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};
