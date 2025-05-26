import React, { useState, useEffect } from 'react';
import Skills from '../components/home/Skills';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        const data = await response.json();
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      }
    };

    fetchSkills();
  }, []);

  return <Skills skills={skills} />;
};

export default SkillsPage;
