
import { SEO } from '../components/ui/SEO';
import { usePolicies } from '../hooks/usePolicies';
import { SectionHeader } from '../components/shared/SectionHeader';
import { ContactInfoBox } from '../components/shared/ContactInfoBox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Ban, 
  Heart, 
  Users, 
  Camera, 
  Volume2, 
  Sparkles, 
  FileText, 
  Lock, 
  Clock, 
  Eye, 
  HelpCircle,
  Flame,
  CigaretteOff,
  Footprints,
  Smile,
  Bell,
  AlertCircle,
  MapPin,
  Zap,
  HeartHandshake
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const POLICY_ICONS: Record<string, LucideIcon> = {
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  Ban,
  Heart,
  Users,
  Camera,
  Volume2,
  Sparkles,
  FileText,
  Lock,
  Clock,
  Eye,
  HelpCircle,
  Flame,
  CigaretteOff,
  Footprints,
  Smile,
  Bell,
  AlertCircle,
  MapPin,
  Zap,
  HeartHandshake
};

// Dynamic Icon Component with tree-shakeable dictionary
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = POLICY_ICONS[name] || Info;
  return <IconComponent className={className} />;
};

export default function Policies() {
  const { policies, safety, loading, error } = usePolicies();

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16">
      <SEO 
        title="Kebijakan & Keamanan | Sougen Creative Management"
        description="Panduan aturan, tata tertib, prosedur keamanan, dan kenyamanan bagi seluruh pengunjung, talent, dan staf di event Sougen Creative Management."
        canonicalUrl="/safety"
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <SectionHeader 
          as="h1"
          label="Tata Tertib"
          title="Kebijakan & Keamanan"
          description="Demi kenyamanan dan keselamatan bersama, mohon perhatikan aturan dan prosedur berikut."
          theme="light"
          align="center"
          className="mb-12"
        />

        {error ? (
          <div className="text-center py-10">
            <p className="text-sougen-blue-dark font-inter font-medium text-lg">Gagal memuat data kebijakan. Silakan coba lagi nanti.</p>
          </div>
        ) : loading ? (
          <div className="space-y-12 max-w-[70ch] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full bg-black/5 rounded-xl border border-black/10" />)}
            </div>
            <Skeleton className="h-48 w-full bg-black/5 rounded-xl border border-black/10" />
          </div>
        ) : (
          <div className="space-y-16 max-w-[70ch] mx-auto">
            
            {/* Kebijakan (Tata Tertib) */}
            <section>
              <h2 className="text-2xl font-poppins font-bold text-rpo-black mb-6 border-b-2 border-sougen-blue pb-2 inline-block">
                Tata Tertib Acara
              </h2>
              {policies.length === 0 ? (
                <p className="text-rpo-black/60 font-inter">Belum ada aturan yang ditambahkan.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {policies.map((policy) => (
                    <div 
                      key={policy.id} 
                      className="flex items-start gap-4 p-5 rounded-xl bg-white border border-rpo-black/10 shadow-sm hover:border-sougen-blue transition-colors duration-300"
                    >
                      <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-sm bg-sougen-blue/10 text-sougen-blue">
                        <DynamicIcon name={policy.iconName} className="w-6 h-6" />
                      </div>
                      <p className="font-inter text-rpo-black/70 leading-relaxed pt-1">
                        {policy.ruleText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Prosedur Keamanan */}
            <section>
              <h2 className="text-2xl font-poppins font-bold text-rpo-black mb-6 border-b-2 border-sougen-blue pb-2 inline-block">
                Prosedur Keamanan Darurat
              </h2>
              {safety.length === 0 ? (
                <p className="text-rpo-black/60 font-inter">Belum ada prosedur keamanan yang ditambahkan.</p>
              ) : (
                <div className="bg-white border border-rpo-black/10 shadow-sm rounded-xl p-4 md:p-8">
                  <Accordion type="single" collapsible className="w-full">
                    {safety.map((proc, index) => (
                      <AccordionItem key={proc.id} value={`safety-${proc.id}`} className="border-b border-black/5 last:border-0">
                        <AccordionTrigger className="text-left font-poppins font-bold text-rpo-black hover:text-sougen-blue text-lg py-5 flex items-start gap-4">
                          <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-sougen-blue text-white text-xs font-black rounded-sm shadow-sm mt-0.5">
                            {index + 1}
                          </span>
                          <span className="flex-1">{proc.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="font-inter text-rpo-black/70 text-base leading-relaxed whitespace-pre-wrap pl-10 pb-6">
                          {proc.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </section>

          </div>
        )}

        {/* Contact Info Box (Highlight Emergency) */}
        <div className="mt-16 max-w-2xl mx-auto text-center border-t border-black/10 pt-16">
          <h3 className="font-poppins text-2xl font-bold text-rpo-black mb-4">
            Butuh Bantuan Mendesak?
          </h3>
          <p className="font-inter text-rpo-black/60 mb-8 max-w-[70ch] mx-auto">
            Hubungi kontak darurat kami atau saluran komunikasi resmi di bawah ini.
          </p>
          <div className="text-left">
            <ContactInfoBox />
          </div>
        </div>

      </div>
    </div>
  );
}
