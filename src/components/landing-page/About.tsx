import SecondHeader from "../landing-page/SecondHeader";
import { doc1, doc2 } from "../../assets";

const About = () => {
  return (
    <main className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden mt-10">
      <SecondHeader />

      <section className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

        <div className="flex flex-col md:flex-row md:space-x-6 mb-8">
          <div className="flex-1 mb-6 md:mb-0">
            <img
              src={doc1}
              alt="Document 1"
              className="w-full h-auto mb-4 rounded-lg shadow-lg"
            />
            <p className="text-lg">
              Situs web ini dirancang untuk menyederhanakan proses pembuatan
              hyperlink, memungkinkan pengguna untuk menghubungkan konten online
              mereka dengan mudah. Apakah Anda seorang blogger, pemilik bisnis,
              atau seseorang yang ingin berbagi informasi, alat kami menyediakan
              antarmuka yang intuitif yang memungkinkan Anda untuk menghasilkan
              hyperlink dengan mudah. Dengan hanya beberapa klik, Anda dapat
              mengubah teks biasa menjadi tautan yang dapat diklik yang
              mengarahkan audiens Anda ke situs web, halaman media sosial, atau
              sumber daya online yang relevan. Ini sangat bermanfaat untuk
              meningkatkan keterlibatan pengguna dan memperbaiki navigasi di
              situs Anda.
            </p>
          </div>

          <div className="flex-1 mb-6 md:mb-0">
            <img
              src={doc2}
              alt="Document 2"
              className="w-full h-auto mb-4 rounded-lg shadow-lg"
            />
            <p className="text-lg">
              Situs web ini menyediakan layanan untuk membuat dan mengelola
              katalog web dengan mudah. Apakah Anda seorang pemilik bisnis,
              pengusaha, atau individu yang ingin menampilkan produk dan layanan
              Anda secara online, platform kami memungkinkan Anda untuk membuat
              katalog digital yang menarik dan informatif. Dengan antarmuka yang
              ramah pengguna, Anda dapat menambahkan, mengedit, dan mengatur
              informasi produk dengan cepat. Anda dapat menyertakan gambar,
              deskripsi, harga, dan detail penting lainnya, sehingga pengunjung
              dapat dengan mudah menemukan apa yang mereka cari. Situs kami juga
              memungkinkan Anda untuk mengkategorikan produk dan layanan Anda,
              membuat navigasi menjadi lebih intuitif bagi pengguna. Fitur
              pencarian yang efisien membantu pengunjung menemukan item tertentu
              dalam katalog Anda tanpa kesulitan.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
