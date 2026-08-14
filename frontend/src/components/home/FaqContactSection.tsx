import { Link } from 'react-router-dom';
import { useFaqs } from '../../hooks/useFaqs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import { Skeleton } from '../ui/Skeleton';
import { ChevronRight } from 'lucide-react';

export function FaqContactSection() {
  const { faqs, loading, error } = useFaqs();

  // Membatasi FAQ yang tampil di halaman Home maksimal 5
  const homeFaqs = faqs.slice(0, 5);

  return (
    <section className="w-full pt-12 pb-28 md:py-16 bg-[#FAFAFA] border-t border-rpo-black/5">
      <div className="mx-auto max-w-[85%] lg:max-w-[75%]">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* KOLOM KIRI (Mobile: Atas, Desktop: Kanan) - FAQ */}
          <div className="order-1 md:order-2">
            {/* Header FAQ */}
            <div className="mb-8">
              <span className="block font-poppins font-bold text-rpo-red text-sm uppercase tracking-wider mb-2 md:text-left text-center">
                you have to know
              </span>
              <h2 className="font-poppins font-black text-3xl md:text-4xl text-rpo-black uppercase md:text-left text-center">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-1 bg-rpo-red mt-4 mb-6 md:mx-0 mx-auto" />
              <p className="font-inter text-rpo-black/70 text-base leading-relaxed md:text-left text-center max-w-[50ch] mx-auto md:mx-0">
                Answers to questions regarding the event, tickets, exhibitors, and other booths.
              </p>
            </div>

            {/* Konten FAQ Card */}
            <div className="bg-white border border-rpo-black/10 shadow-sm rounded-xl p-4 md:p-6">
              {error ? (
                <p className="text-center text-rpo-red py-4 font-inter text-sm">Gagal memuat pertanyaan.</p>
              ) : loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl bg-black/5" />
                  ))}
                </div>
              ) : homeFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-rpo-black/50 font-inter text-sm">Belum ada pertanyaan yang ditambahkan.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {homeFaqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`home-faq-${faq.id}`} className="border-b border-black/5 last:border-0">
                      <AccordionTrigger className="text-left font-poppins font-bold text-rpo-black hover:text-rpo-red text-sm md:text-base py-4 flex items-start gap-3">
                        <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-rpo-red text-white text-[10px] font-black rounded-sm shadow-sm mt-0.5">
                          {index + 1}
                        </span>
                        <span className="flex-1">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="font-inter text-rpo-black/70 text-sm leading-relaxed whitespace-pre-wrap pl-8 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
            
            {!loading && homeFaqs.length > 0 && (
              <div className="mt-6 text-center md:text-left">
                <Link to="/faq" className="inline-block font-poppins font-bold text-rpo-red text-sm hover:text-black transition-colors duration-300">
                  Lihat Semua FAQ &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (Mobile: Bawah, Desktop: Kiri) - Contact CTA */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1">
            <div className="w-full md:max-w-md mx-auto md:mx-0">
              <h3 className="font-poppins font-black text-3xl md:text-4xl text-rpo-black mb-6 leading-tight">
                Masih ada pertanyaan? langsung kirim ke kami!
              </h3>
              <p className="font-inter text-rpo-black/60 mb-8 max-w-sm mx-auto md:mx-0">
                Tim RPO siap membantu menjawab pertanyaan spesifik atau mendiskusikan peluang kolaborasi di event selanjutnya.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-rpo-red text-white font-poppins font-bold px-8 py-4 rounded-sm hover:bg-black transition-colors duration-300 w-full sm:w-auto group shadow-md"
              >
                Hubungi Kami
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
