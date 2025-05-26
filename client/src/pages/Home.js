import React, { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Skills from '../components/home/Skills';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';
import { useApi } from '../hooks/useApi';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, skillsResponse] = await Promise.all([
          apiCall('/api/projects?featured=true&limit=3', 'GET'),
          apiCall('/api/skills', 'GET')
        ]);
        
        setProjects(projectsResponse.data);
        setSkills(skillsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEO 
        title="Sai Chandhan Reddy - Full Stack Developer"
        description="Welcome to my portfolio. I'm a full-stack developer passionate about creating amazing web experiences."
        keywords="portfolio, developer, full-stack, react, node.js, javascript"
      />
      
      <div className="min-h-screen">
        <Hero />
        <FeaturedProjects projects={projects} />
        <Skills skills={skills} />
        
        {/* Call to Action Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to work together?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              I'm always interested in new opportunities and exciting projects. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="space-x-4">
              <a
                href="/contact"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get In Touch
              </a>
              <a
                href="/projects"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View My Work
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Clients Say</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Excellent work quality and great communication throughout the project. 
                  Delivered exactly what we needed on time and within budget."
                </p>
                <div className="flex items-center">
                  <img 
                    src="data:image/jpeg;base64,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" 
                    alt="Client" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-gray-600 text-sm">CEO, Tech Startup</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Professional, reliable, and skilled developer. The website exceeded our 
                  expectations and has significantly improved our online presence."
                </p>
                <div className="flex items-center">
                  <img 
                    src="data:image/jpeg;base64,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" 
                    alt="Client" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-gray-600 text-sm">Marketing Director</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;