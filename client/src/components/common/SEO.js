import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Sai Chandhan Reddy - Full Stack Developer',
  description = 'Full-stack developer specializing in React, Node.js, and modern web technologies. View my projects, blog posts, and get in touch.',
  keywords = 'full stack developer, react developer, node.js, web development, portfolio',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = 'Sai Chandhan Reddy Annapureddy',
  siteName = 'Saichandhan.com'
}) => {
  const fullTitle = title.includes('Portfolio') ? title : `${title} | Portfolio`;
  const fullImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@yourtwitterhandle" />
      <meta name="twitter:site" content="@yourtwitterhandle" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": author,
          "url": url,
          "image": fullImage,
          "description": description,
          "jobTitle": "Full Stack Developer",
          "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
          },
          "sameAs": [
            "https://github.com/SAI-CHANDHAN",
            "https://linkedin.com/in/saichandhanannapureddy",
            "https://www.instagram.com/sai_chandhan?igsh=MWw0anU1Y3RuOGh2dA=="
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;