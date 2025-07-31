import { SearchSuggestions } from "./components/SearchSuggestions";
import {
  LanguageProvider,
  useLanguage,
} from "./components/LanguageContext";
import { Toaster } from 'sonner';

function AppContent() {
  const { t } = useLanguage();

  return (
    <div className="app-container">
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center mb-5">
              <h1 className="mb-3">{t.appTitle}</h1>
              <p className="text-muted">{t.appDescription}</p>
            </div>

            <SearchSuggestions />
          </div>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'var(--app-bg)',
            color: 'var(--app-text)',
            border: '1px solid var(--app-border)',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}