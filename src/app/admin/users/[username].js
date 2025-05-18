import prisma from '@/lib/prisma'; 

export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      }
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  } else {
    res.status(405).json({ success: false, message: "Yalnızca GET isteği kabul edilir." });
  }
}
