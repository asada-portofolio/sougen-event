import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import { ScrollToTop } from './components/shared/ScrollToTop'

const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))

const Home = lazy(() => import('./pages/Home'))
const EventList = lazy(() => import('./pages/EventList'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const LineUp = lazy(() => import('./pages/LineUp'))
const Community = lazy(() => import('./pages/Community'))
const Programs = lazy(() => import('./pages/Programs'))
const GalleryOverview = lazy(() => import('./pages/GalleryOverview'))
const GalleryDetail = lazy(() => import('./pages/GalleryDetail'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Policies = lazy(() => import('./pages/Policies'))
const Contact = lazy(() => import('./pages/Contact'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminEventList = lazy(() => import('./pages/admin/AdminEventList'))
const AdminEventDetail = lazy(() => import('./pages/admin/AdminEventDetail'))
const AdminTalentList = lazy(() => import('./pages/admin/AdminTalentList'))
const AdminTalentForm = lazy(() => import('./pages/admin/AdminTalentForm'))
const AdminCommunityList = lazy(() => import('./pages/admin/AdminCommunityList'))
const AdminCommunityForm = lazy(() => import('./pages/admin/AdminCommunityForm'))
const AdminProgramList = lazy(() => import('./pages/admin/AdminProgramList'))
const AdminProgramForm = lazy(() => import('./pages/admin/AdminProgramForm'))
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'))
const AdminKebijakan = lazy(() => import('./pages/admin/AdminKebijakan'))
const AdminKontak = lazy(() => import('./pages/admin/AdminKontak'))
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

const PageLoader = () => (
  <div className="w-full min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="w-12 h-12 border-4 border-sougen-blue border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<EventList />} />
            <Route path="/event/:slug" element={<EventDetail />} />
            <Route path="/lineup" element={<LineUp />} />
            <Route path="/community" element={<Community />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/gallery" element={<GalleryOverview />} />
            <Route path="/gallery/:slug" element={<GalleryDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/safety" element={<Policies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/event" element={<AdminEventList />} />
              <Route path="/admin/event/:id" element={<AdminEventDetail />} />
              <Route path="/admin/talent" element={<AdminTalentList />} />
              <Route path="/admin/talent/:id" element={<AdminTalentForm />} />
              <Route path="/admin/community" element={<AdminCommunityList />} />
              <Route path="/admin/community/:id" element={<AdminCommunityForm />} />
              <Route path="/admin/programs" element={<AdminProgramList />} />
              <Route path="/admin/programs/:id" element={<AdminProgramForm />} />
              <Route path="/admin/faq" element={<AdminFAQ />} />
              <Route path="/admin/safety" element={<AdminKebijakan />} />
              <Route path="/admin/kontak" element={<AdminKontak />} />
              <Route path="/admin/about" element={<AdminAbout />} />
              <Route path="/admin/pengaturan" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}