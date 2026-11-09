import type { CSSProperties } from 'react';
import { formatRange } from '../lib/format';
import type { Resume } from '../types';

interface PreviewProps {
  resume: Resume;
}

const toLines = (text: string): string[] =>
  text
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean);

export function Preview({ resume }: PreviewProps) {
  const { personal, experience, education, settings } = resume;
  const skills = resume.skills.split(',').map((s) => s.trim()).filter(Boolean);
  const contact = [personal.email, personal.phone, personal.location, personal.website].filter(Boolean);
  const style = { '--accent': settings.accent } as CSSProperties;

  return (
    <article className={`sheet tpl-${settings.template}`} style={style} aria-label="Resume preview">
      <header className="sheet-head">
        <h1>{personal.name || 'Your Name'}</h1>
        {personal.title && <p className="sheet-title">{personal.title}</p>}
        {contact.length > 0 && (
          <ul className="sheet-contact">
            {contact.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </header>

      {resume.summary && (
        <section className="sheet-section">
          <h2>Professional Summary</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="sheet-section">
          <h2>Experience</h2>
          <ol className="timeline">
            {experience.map((job) => (
              <li key={job.id}>
                <div className="job-head">
                  <strong>{job.role || 'Role'}</strong>
                  <span className="dates">{formatRange(job.start, job.end, job.current)}</span>
                </div>
                {job.company && <div className="company">{job.company}</div>}
                {toLines(job.bullets).length > 0 && (
                  <ul className="bullets">
                    {toLines(job.bullets).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {education.length > 0 && (
        <section className="sheet-section">
          <h2>Education</h2>
          {education.map((edu) => (
            <div className="edu" key={edu.id}>
              <div className="job-head">
                <strong>{edu.degree || 'Degree'}</strong>
                <span className="dates">{[edu.start, edu.end].filter(Boolean).join(' – ')}</span>
              </div>
              <div className="company">{edu.school}</div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="sheet-section">
          <h2>Skills</h2>
          <ul className="chips">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
