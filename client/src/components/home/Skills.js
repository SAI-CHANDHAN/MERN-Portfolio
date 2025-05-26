import React, { useState, useEffect, useRef } from 'react';
import './Skills.css';

const Skills = ({ skills }) => {
  const [visibleSkills, setVisibleSkills] = useState(new Set());
  const skillsRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillId = entry.target.dataset.skillId;
            setVisibleSkills(prev => new Set([...prev, skillId]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const skillElements = skillsRef.current?.querySelectorAll('.skill-item');
    skillElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [skills]);

  // Group skills safely
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill?.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const categoryIcons = {
    Frontend: '🎨',
    Backend: '⚙️',
    Database: '🗃️',
    Tools: '🛠️',
    Languages: '💻',
    Other: '📦',
  };

  const groupedEntries = Object.entries(groupedSkills);

  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies I work with to bring ideas to life</p>
        </div>

        <div className="skills-container" ref={skillsRef}>
          {groupedEntries.length > 0 ? (
            groupedEntries.map(([category, categorySkills]) => {
              if (!Array.isArray(categorySkills)) return null;

              return (
                <div key={category} className="skill-category">
                  <h3 className="category-title">
                    <span className="category-icon">{categoryIcons[category]}</span>
                    {category}
                  </h3>

                  <div className="skills-grid">
                    {categorySkills.map(skill => (
                      <div
                        key={skill._id || skill.name}
                        className="skill-item"
                        data-skill-id={skill._id}
                      >
                        <div className="skill-icon">
                          {skill.icon ? (
                            <img src={skill.icon} alt={skill.name} />
                          ) : (
                            <div className="skill-placeholder">{skill.name?.charAt(0).toUpperCase()}</div>
                          )}
                        </div>

                        <div className="skill-info">
                          <h4 className="skill-name">{skill.name}</h4>
                          <div className="skill-level">
                            <div className="level-bar">
                              <div
                                className={`level-fill ${visibleSkills.has(skill._id) ? 'animate' : ''}`}
                                style={{ width: visibleSkills.has(skill._id) ? `${skill.proficiency || 0}%` : '0%' }}
                              />
                            </div>
                            <span className="level-text">{skill.proficiency || 0}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
          <div className="no-skills">
            <p>Skills will be displayed here once added.</p>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
