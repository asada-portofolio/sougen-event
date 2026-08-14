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
    <div className="w-full min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16">
      <SEO 
        title="FAQ & Pusat Bantuan | Reality Project Organizer"
        description="Temukan jawaban atas pertanyaan yang sering diajukan seputar event, komunitas, dan kolaborasi dengan Reality Project Organizer."
        canonicalUrl="/faq"
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <SectionHeader 
          label="Pusat Bantuan"
          title="Frequently Asked Questions"
          description="Punya pertanyaan seputar acara, tiket, atau hal lainnya? Temukan jawabannya di sini."
          theme="light"
          align="center"
          className="mb-10"
        />

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rpo-black/40" />
          <Input 
            type="text"
            placeholder="Cari pertanyaan Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 py-6 bg-white border-rpo-black/10 focus-visible:ring-rpo-red text-lg text-rpo-black rounded-sm shadow-sm placeholder:text-rpo-black/30"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white border border-rpo-black/10 shadow-sm rounded-xl p-4 md:p-8 mb-16 max-w-[70ch] mx-auto">
          {error ? (
            <p className="text-center text-rpo-red py-10 font-inter">Gagal memuat pertanyaan. Silakan coba lagi nanti.</p>
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
                  <AccordionTrigger className="text-left font-poppins font-bold text-rpo-black hover:text-rpo-red text-lg py-5 flex items-start gap-4">
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-rpo-red text-white text-xs font-black rounded-sm shadow-sm mt-0.5">
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