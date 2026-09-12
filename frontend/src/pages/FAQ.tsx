import { useState, useMemo } from 'react';
import { SEO } from '../components/ui/SEO';
import { Search } from 'lucide-react';
import { useFaqs } from '../hooks/useFaqs';
import { SectionHeader } from '../components/shared/SectionHeader';
import { ContactInfoBox } from '../components/shared/ContactInfoBox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';

export default function FAQ() {
  const { faqs, loading, error } = useFaqs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery)
    );
  }, [faqs, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-rpo-black">
      <SEO 
        title="FAQ & Pusat Bantuan | Sougen Creative Management"
        description="Temukan jawaban atas pertanyaan yang sering diajukan seputar event, komunitas, dan kolaborasi dengan Sougen Creative Management."
        canonicalUrl="/faq"
      />

      {/* Intro Section */}
      <div className="w-full bg-[#00486E] pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <SectionHeader 
            as="h1"
            label="HELP CENTER"
            title="FREQUENTLY ASKED QUESTIONS"
            description="Punya pertanyaan seputar acara, tiket, komunitas, atau hal lainnya? Temukan jawabannya di sini."
            theme="dark"
            align="full-center"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rpo-black/40" />
          <Input 
            type="text"
            placeholder="Cari pertanyaan Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 py-6 bg-white border-rpo-black/10 focus-visible:ring-sougen-blue focus-visible:border-sougen-blue text-lg text-rpo-black rounded-sm shadow-sm placeholder:text-rpo-black/30"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white border border-rpo-black/10 shadow-sm rounded-xl p-4 md:p-8 mb-16 max-w-[70ch] mx-auto">
          {error ? (
            <p className="text-center text-sougen-blue-dark py-10 font-inter font-medium">Gagal memuat pertanyaan. Silakan coba lagi nanti.</p>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl bg-black/5" />
              ))}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-rpo-black/50 font-inter text-lg">Tidak ada hasil yang ditemukan untuk "{searchQuery}"</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border-b border-black/5 last:border-0">
                  <AccordionTrigger className="text-left font-poppins font-bold text-rpo-black hover:text-sougen-blue text-lg py-5 flex items-start gap-4">
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-sougen-blue text-white text-xs font-black rounded-sm shadow-sm mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="font-inter text-rpo-black/70 text-base leading-relaxed whitespace-pre-wrap pl-10 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Contact Info Box Fallback */}
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-poppins text-2xl font-bold text-rpo-black mb-4">
            Belum Menemukan Jawaban?
          </h3>
          <p className="font-inter text-rpo-black/60 mb-8 max-w-[70ch] mx-auto">
            Jangan ragu untuk menghubungi tim kami secara langsung. Kami akan dengan senang hati membantu Anda.
          </p>
          <div className="text-left">
            <ContactInfoBox />
          </div>
        </div>
      </div>
    </div>
  );
}