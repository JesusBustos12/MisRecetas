import '../../public/CSS/index.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'),
  title: {
    default: 'MisRecetas | Sabores del Mundo',
    template: '%s | MisRecetas',
  },
  description:
    'Descubre y comparte las mejores recetas de gastronomía internacional. Italia, México, Japón y más en un solo lugar.',
  keywords: [
    'recetas',
    'cocina',
    'gastronomía',
    'comida internacional',
    'chef',
    'aprender a cocinar',
  ],
  authors: [{ name: 'Antigravity AI' }],
  creator: 'Antigravity Team',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://misrecetas.com',
    siteName: 'MisRecetas',
    title: 'MisRecetas | Tu portal de cocina internacional',
    description: 'La comunidad más grande de amantes de la cocina del mundo.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MisRecetas Banner' }],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
