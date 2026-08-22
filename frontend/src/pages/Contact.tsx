import { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { SectionHeader } from '../components/shared/SectionHeader';
import { ContactInfoBox } from '../components/shared/ContactInfoBox';
import { api } from '../services/api';

const contactFormSchema = z.object({
  senderName: z.string().min(2, { message: 'Nama minimal 2 karakter.' }),
  senderEmail: z.string().email({ message: 'Email tidak valid.' }),
  senderPhone: z.string().optional(),
  message: z.string().min(10, { message: 'Pesan terlalu singkat (minimal 10 karakter).' }),
  website: z.string().optional(), // Honeypot
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onTouched',
    defaultValues: {
      senderName: '',
      senderEmail: '',
      senderPhone: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setSubmitStatus('loading');
      setErrorMessage(null);
      await api.post('/api/contact/messages', data);
      setSubmitStatus('success');
      reset();
    } catch (err) {
      setSubmitStatus('error');
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setErrorMessage(axiosErr.response?.data?.error || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-rpo-black">
      <SEO 
        title="Hubungi Kami | Sougen Creative Management"
        description="Hubungi tim Sougen Creative Management untuk kolaborasi kemitraan, sponsor, media partner, pertanyaan umum, atau informasi seputar event kami."
        canonicalUrl="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Hubungi Sougen Creative Management",
          "description": "Formulir kontak dan daftar saluran komunikasi resmi Sougen Creative Management.",
          "url": "https://sougen.id/contact",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support"
          }
        }}
      />

      {/* Intro Section */}
      <div className="w-full bg-[#00486E] pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <SectionHeader 
            as="h1"
            label="LET'S CONNECT"
            title="CONTACT US"
            description="Punya pertanyaan, ide kolaborasi, atau butuh bantuan untuk acara Anda? Jangan ragu untuk menghubungi tim Sougen melalui kanal di bawah ini."
            theme="dark"
            align="full-center"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Sisi Kiri: Kanal Komunikasi Aktif */}
          <div className="order-2 lg:order-1">
            <h2 className="font-poppins text-2xl font-bold text-rpo-black mb-6">
              Kanal Resmi Kami
            </h2>
            <p className="font-inter text-rpo-black/70 mb-8 leading-relaxed">
              Tim kami selalu siap membantu Anda. Untuk kebutuhan darurat atau respons cepat, silakan hubungi kontak prioritas yang telah kami sediakan.
            </p>
            <ContactInfoBox />
          </div>

          {/* Sisi Kanan: Form Pesan Langsung */}
          <div className="bg-white border border-rpo-black/10 p-8 rounded-xl shadow-sm order-1 lg:order-2">
            <h2 className="font-poppins text-2xl font-bold text-rpo-black mb-2">
              Kirim Pesan
            </h2>
            <p className="font-inter text-rpo-black/60 text-sm mb-8">
              Isi formulir di bawah ini dan kami akan membalas secepat mungkin.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 rounded-sm bg-green-50 border border-green-200 flex items-start gap-3 text-green-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="font-inter text-sm">
                  Pesan Anda telah berhasil dikirim! Tim kami akan segera menghubungi Anda kembali.
                </p>
              </div>
            )}

            {submitStatus === 'error' && errorMessage && (
              <div className="mb-6 p-4 rounded-sm bg-red-50 border border-red-200 flex items-start gap-3 text-rpo-negative">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="font-inter text-sm">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              <div>
                <label htmlFor="senderName" className="block text-sm font-bold text-rpo-black mb-1.5 font-inter">
                  Nama Lengkap <span className="text-sougen-blue">*</span>
                </label>
                <input
                  id="senderName"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full bg-[#FAFAFA] border border-rpo-black/10 text-rpo-black rounded-sm px-4 py-3 focus:outline-none focus:border-sougen-blue focus:ring-1 focus:ring-sougen-blue transition-colors font-inter placeholder:text-rpo-black/30"
                  disabled={isSubmitting}
                  {...register('senderName')}
                />
                {errors.senderName && (
                  <p className="text-rpo-negative text-xs mt-1.5 font-inter">{errors.senderName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="senderEmail" className="block text-sm font-bold text-rpo-black mb-1.5 font-inter">
                    Alamat Email <span className="text-sougen-blue">*</span>
                  </label>
                  <input
                    id="senderEmail"
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full bg-[#FAFAFA] border border-rpo-black/10 text-rpo-black rounded-sm px-4 py-3 focus:outline-none focus:border-sougen-blue focus:ring-1 focus:ring-sougen-blue transition-colors font-inter placeholder:text-rpo-black/30"
                    disabled={isSubmitting}
                    {...register('senderEmail')}
                  />
                  {errors.senderEmail && (
                    <p className="text-rpo-negative text-xs mt-1.5 font-inter">{errors.senderEmail.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="senderPhone" className="block text-sm font-bold text-rpo-black mb-1.5 font-inter">
                    Nomor WhatsApp / Telp
                  </label>
                  <input
                    id="senderPhone"
                    type="tel"
                    placeholder="0812xxxxxx"
                    className="w-full bg-[#FAFAFA] border border-rpo-black/10 text-rpo-black rounded-sm px-4 py-3 focus:outline-none focus:border-sougen-blue focus:ring-1 focus:ring-sougen-blue transition-colors font-inter placeholder:text-rpo-black/30"
                    disabled={isSubmitting}
                    {...register('senderPhone')}
                  />
                  {errors.senderPhone && (
                    <p className="text-rpo-negative text-xs mt-1.5 font-inter">{errors.senderPhone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-rpo-black mb-1.5 font-inter">
                  Pesan <span className="text-sougen-blue">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                  className="w-full bg-[#FAFAFA] border border-rpo-black/10 text-rpo-black rounded-sm px-4 py-3 focus:outline-none focus:border-sougen-blue focus:ring-1 focus:ring-sougen-blue transition-colors font-inter placeholder:text-rpo-black/30 resize-y min-h-[120px]"
                  disabled={isSubmitting}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-rpo-negative text-xs mt-1.5 font-inter">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto mt-4 px-8 py-3 bg-rpo-black text-white font-poppins font-bold rounded-sm hover:bg-sougen-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}