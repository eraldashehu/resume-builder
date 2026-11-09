import { memo } from 'react';
import type { CSSProperties } from 'react';
import { formatRange, toLines } from '../../lib/format';
import type { Resume } from '../../model/types';

interface ResumePreviewProps {
  resume: Resume;
  /** True while the preview is showing slightly older data than the editor. */
  stale?: boolean;
}

/**
 * The printable A4 sheet. Plain HTML and CSS (not Ant Design), so the PDF
 * looks exactly like the screen. Memoized: it only re-renders when `resume` changes.
 */
export const ResumePreview = memo(function ResumePreview({ resume, stale = false }: ResumePreviewProps) {
  const { personal, summary, experience, education, skills, settings } = resume;
  const contact = [personal.email, personal.phone, personal.location, personal.website].filter(Boolean);
  const style = { '--accent': settings.accent, opacity: stale ? 0.85 : 1 } as CSSProperties;

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

      {summary && (
        <section className="sheet-section">
          <h2>Professional Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="sheet-section">
          <h2>Experience</h2>
          <ol className="timeline">
            {experience.map((job) => {
              const bullets = toLines(job.bullets);
              return (
                <li key={job.id}>
                  <div className="job-head">
                    <strong>{job.role || 'Role'}</strong>
                    <span className="dates">{formatRange(job.start, job.end, job.current)}</span>
                  </div>
                  {job.company && <div className="company">{job.company}</div>}
                  {bullets.length > 0 && (
                    <ul className="bullets">
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
});
