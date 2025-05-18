#  Film & Dizi İnceleme Platformu

Kullanıcıların dizi ve filmleri inceleyebildiği, yorum yapabildiği, birbirlerine mesaj gönderebildiği ve admin paneli üzerinden içerik yönetiminin yapılabildiği bir web uygulamasıdır.

---

##  Proje Tanımı

Bu proje, kullanıcıların sevdikleri dizi ve filmleri değerlendirebildiği, diğer kullanıcıların yorumlarını okuyabildiği ve platform üzerindeki kullanıcılarla mesajlaşabildiği bir sosyal medya tarzı inceleme platformudur.

###  Giriş Yapan Kullanıcılar:
-  Filmler hakkında yorum yapabilir  
-  Diğer kullanıcıların yorumlarını okuyabilir  
-  Diğer kullanıcılara mesaj gönderebilir  

###  Admin Kullanıcılar:
-  Yeni film/dizi ekleyebilir  
-  Yorumları inceleyebilir  
-  Kullanıcıları görüntüleyebilir  

---

## Kullanılan Teknolojiler

- **Next.js 14** – Sunucu tarafı render destekli React framework  
- **Prisma ORM** – Veritabanı işlemleri için  
- **SQLite** – Dosya tabanlı, hızlı ve kolay veritabanı  
- **Bootstrap 5** – Arayüz ve stil tasarımı için  
- **jsonwebtoken (JWT)** – Kimlik doğrulama mekanizması  
- **bcryptjs** – Şifreleri güvenli şekilde saklamak için  
- **@prisma/client** – Prisma veritabanı istemcisi  

---

##  Kurulum Talimatları

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

### 1. Projeyi klonlayın:
```bash
git clone https://github.com/ozlemberrakk/film-dizi-inceleme.git
cd film-dizi-inceleme
```

### 2. Bağımlılıkları yükleyin:
```bash
npm install
```

### 3. `.env` dosyasını oluşturun:
Proje dizininde `.env` dosyası oluşturun ve şu içeriği ekleyin:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="237725"
```

### 4. Veritabanını oluşturun ve migrasyonları uygulayın:
```bash
npx prisma migrate dev --name init
```

### 5. Uygulamayı başlatın:
```bash
npm run dev
```

Uygulamaya `http://localhost:3000` adresinden erişebilirsiniz.

---

##  Admin Giriş Bilgileri

| Email                     | Şifre   |
|--------------------------|---------|
| ozlemberrakk@gmail.com   | 237725  |

---

##  Örnek Kullanıcı Bilgileri

| Kullanıcı Adı   | Email                       | Şifre   |
|----------------|-----------------------------|---------|
| kayipyildiz    | kayipyildiz@gmail.com       | 123456  |
| sessizfirtina  | sessizfirtina@gmail.com     | 123456  |

> Tüm kullanıcıların e-posta adresleri kullanıcı adlarına uyumlu olacak şekilde ayarlanmıştır. Şifreleri aynıdır.Admin panelinden tüm kullanıcıları listeyebilirsiniz.

---

##  Hazırlayan

- **Ad:** Özlem Berrak Anıt  
- **Ders:** İnternet Programcılığı II  
- **Proje:** Film-Dizi İnceleme Platformu